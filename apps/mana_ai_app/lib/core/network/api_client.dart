import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_endpoint.dart';
import '../constants/api_constants.dart';
import '../foundation/app_failure.dart';
import '../security/sensitive_data_redactor.dart';
import '../services/secure_id_generator.dart';
import 'api_request.dart';
import 'api_response.dart';
import 'api_result.dart';
import 'interceptors/error_interceptor.dart';
import 'request_headers.dart';
import 'request_cancellation.dart';
import 'request_metadata.dart';
import 'retry_policy.dart';

final class ApiClient {
  ApiClient({
    required ApiEndpoint endpoint,
    required http.Client client,
    required RequestHeaders headers,
    RetryPolicy? retryPolicy,
    SecureIdGenerator? idGenerator,
  })  : _endpoint = endpoint,
        _client = client,
        _headers = headers,
        _retryPolicy = retryPolicy ?? RetryPolicy(),
        _idGenerator = idGenerator ?? SecureIdGenerator();

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final RequestHeaders _headers;
  final RetryPolicy _retryPolicy;
  final SecureIdGenerator _idGenerator;
  bool _closed = false;

  Future<ApiResult<ApiResponse<T>>> send<T>(
    ApiRequest request, {
    required T Function(Object? json) decode,
  }) async {
    if (_closed) {
      throw StateError('ApiClient is closed.');
    }

    final uri = _endpoint
        .resolve(request.path)
        .replace(queryParameters: request.queryParameters.isEmpty
            ? null
            : request.queryParameters,);
    final maximumAttempts =
        request.isIdempotent ? _retryPolicy.maxRetries + 1 : 1;

    for (var attempt = 1; attempt <= maximumAttempts; attempt++) {
      request.cancellation?.throwIfCancelled();
      final metadata = RequestMetadata(
        requestId: _idGenerator.nextUuid(),
        startedAt: DateTime.now().toUtc(),
        attempt: attempt,
      );

      try {
        final response = await _sendAttempt(request, uri, metadata);
        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            final json = response.body.isEmpty
                ? null
                : jsonDecode(response.body) as Object?;
            return ApiSuccess(
              ApiResponse<T>(
                statusCode: response.statusCode,
                headers: response.headers,
                data: decode(json),
                requestId: metadata.requestId,
              ),
            );
          } on FormatException {
            return const ApiError(
              AppFailure(
                kind: FailureKind.server,
                code: 'invalid_response',
                message: 'The service returned an invalid response.',
              ),
            );
          } on TypeError {
            return const ApiError(
              AppFailure(
                kind: FailureKind.server,
                code: 'invalid_response',
                message: 'The service returned data in an unexpected format.',
              ),
            );
          }
        }

        final failure = ErrorInterceptor.fromStatusCode(
          response.statusCode,
          code: _serverErrorCode(response.body),
        );
        if (attempt < maximumAttempts &&
            _retryPolicy.shouldRetry(
              retryNumber: attempt,
              isIdempotent: request.isIdempotent,
              statusCode: response.statusCode,
            )) {
          await Future<void>.delayed(_retryPolicy.delayFor(attempt));
          continue;
        }
        return ApiError(failure);
      } on RequestCancelledException {
        return const ApiError(
          AppFailure(
            kind: FailureKind.cancelled,
            message: 'The request was cancelled.',
          ),
        );
      } on TimeoutException {
        if (attempt < maximumAttempts &&
            _retryPolicy.shouldRetry(
              retryNumber: attempt,
              isIdempotent: request.isIdempotent,
              networkFailure: true,
            )) {
          await Future<void>.delayed(_retryPolicy.delayFor(attempt));
          continue;
        }
        return const ApiError(
          AppFailure(
            kind: FailureKind.timeout,
            message: 'The service did not respond in time.',
            isRetryable: true,
          ),
        );
      } on http.ClientException {
        if (attempt < maximumAttempts &&
            _retryPolicy.shouldRetry(
              retryNumber: attempt,
              isIdempotent: request.isIdempotent,
              networkFailure: true,
            )) {
          await Future<void>.delayed(_retryPolicy.delayFor(attempt));
          continue;
        }
        return const ApiError(
          AppFailure(
            kind: FailureKind.unavailable,
            message: 'The service could not be reached.',
            isRetryable: true,
          ),
        );
      } on FormatException {
        return const ApiError(
          AppFailure(
            kind: FailureKind.validation,
            message: 'The request path or parameters are invalid.',
          ),
        );
      }
    }

    return const ApiError(
      AppFailure(
        kind: FailureKind.unavailable,
        message: 'The service could not be reached.',
        isRetryable: true,
      ),
    );
  }

  Future<http.Response> _sendAttempt(
    ApiRequest request,
    Uri uri,
    RequestMetadata metadata,
  ) async {
    final abortTrigger = request.cancellation?.whenCancelled;
    final outgoing = http.AbortableRequest(
      request.methodName,
      uri,
      abortTrigger: abortTrigger,
    );
    outgoing.headers.addAll(
      _headers.build(metadata, base: request.headers),
    );

    final body = request.encodedBody;
    if (body != null) {
      outgoing.headers.putIfAbsent(
        'content-type',
        () => ApiConstants.contentTypeJson,
      );
      outgoing.bodyBytes = body;
    }

    final streamed = await _client.send(outgoing).timeout(
      request.connectTimeout,
      onTimeout: () {
        throw TimeoutException('Connection timed out.');
      },
    );
    if (streamed.contentLength != null &&
        streamed.contentLength! > ApiConstants.maximumResponseBytes) {
      throw http.ClientException('Response exceeds the configured limit.');
    }

    final response = await http.Response.fromStream(
      _limitResponseBytes(streamed),
    ).timeout(
      request.receiveTimeout,
      onTimeout: () => throw TimeoutException('Response timed out.'),
    );
    return response;
  }

  http.StreamedResponse _limitResponseBytes(http.StreamedResponse response) {
    var receivedBytes = 0;
    final chunks = response.stream.transform(
      StreamTransformer<List<int>, List<int>>.fromHandlers(
        handleData: (chunk, sink) {
          receivedBytes += chunk.length;
          if (receivedBytes > ApiConstants.maximumResponseBytes) {
            sink.addError(
              http.ClientException(
                'Response exceeds the configured limit.',
              ),
            );
          } else {
            sink.add(chunk);
          }
        },
      ),
    );

    return http.StreamedResponse(
      chunks,
      response.statusCode,
      contentLength: response.contentLength,
      request: response.request,
      headers: response.headers,
      isRedirect: response.isRedirect,
      persistentConnection: response.persistentConnection,
      reasonPhrase: response.reasonPhrase,
    );
  }

  String? _serverErrorCode(String body) {
    try {
      final json = jsonDecode(body);
      if (json is Map<String, dynamic>) {
        final code = json['code'] ?? json['error'];
        if (code is String && code.length <= 80) {
          return SensitiveDataRedactor.redact(code);
        }
      }
    } on FormatException {
      return null;
    }
    return null;
  }

  void close() {
    if (_closed) return;
    _closed = true;
    _client.close();
  }
}
