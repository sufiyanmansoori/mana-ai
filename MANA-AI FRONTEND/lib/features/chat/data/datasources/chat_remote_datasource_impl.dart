import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/constants/api_constants.dart';
import 'package:mana_ai_app/core/error/app_exception.dart';
import 'package:mana_ai_app/core/foundation/app_failure.dart';
import 'package:mana_ai_app/core/network/request_cancellation.dart';
import 'package:mana_ai_app/core/network/request_headers.dart';
import 'package:mana_ai_app/core/network/request_metadata.dart';
import 'package:mana_ai_app/core/network/sse/sse_stream_decoder.dart';
import 'package:mana_ai_app/core/services/secure_id_generator.dart';

import '../../domain/entities/chat_message.dart';
import '../../domain/entities/stream_chunk_entity.dart';
import '../models/stream_chunk_model.dart';
import 'chat_remote_datasource.dart';

final class OpenAiCompatibleChatRemoteDataSource
    implements ChatRemoteDataSource {
  static const maximumMessages = 100;
  static const maximumRequestBytes = 2 * 1024 * 1024;

  OpenAiCompatibleChatRemoteDataSource({
    required ApiEndpoint endpoint,
    required http.Client client,
    required RequestHeaders headers,
    this.path = 'v1/chat/completions',
    this.connectTimeout = ApiConstants.defaultConnectTimeout,
    this.idleTimeout = const Duration(seconds: 45),
    this.maximumStreamBytes = ApiConstants.maximumResponseBytes,
    SecureIdGenerator? idGenerator,
  })  : _endpoint = endpoint,
        _client = client,
        _headers = headers,
        _idGenerator = idGenerator ?? SecureIdGenerator() {
    if (connectTimeout <= Duration.zero ||
        idleTimeout <= Duration.zero ||
        maximumStreamBytes < 1) {
      throw ArgumentError('Streaming limits must be positive.');
    }
    _endpoint.resolve(path);
  }

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final RequestHeaders _headers;
  final SecureIdGenerator _idGenerator;
  final String path;
  final Duration connectTimeout;
  final Duration idleTimeout;
  final int maximumStreamBytes;

  @override
  Stream<StreamChunkEntity> streamCompletion({
    required String model,
    required List<ChatMessage> messages,
    required RequestCancellation cancellation,
  }) async* {
    final normalizedModel = model.trim();
    if (!RegExp(r'^[A-Za-z0-9._:-]{1,128}$').hasMatch(normalizedModel)) {
      throw ArgumentError.value(model, 'model');
    }
    if (messages.isEmpty || messages.length > maximumMessages) {
      throw ArgumentError.value(
        messages.length,
        'messages',
        'Provide between 1 and $maximumMessages messages.',
      );
    }
    cancellation.throwIfCancelled();

    final metadata = RequestMetadata(
      requestId: _idGenerator.nextUuid(),
      startedAt: DateTime.now().toUtc(),
    );
    final request = http.AbortableRequest(
      'POST',
      _endpoint.resolve(path),
      abortTrigger: cancellation.whenCancelled,
    );
    request.headers.addAll(
      _headers.build(
        metadata,
        base: const {
          'accept': 'text/event-stream',
          'content-type': ApiConstants.contentTypeJson,
        },
      ),
    );
    final bodyBytes = utf8.encode(
      jsonEncode({
        'model': normalizedModel,
        'stream': true,
        'messages': [
          for (final message in messages)
            {
              'role': message.role.name,
              'content': message.content,
            },
        ],
      }),
    );
    if (bodyBytes.length > maximumRequestBytes) {
      throw ArgumentError(
        'The chat request exceeds the configured size limit.',
      );
    }
    request.bodyBytes = bodyBytes;

    late final http.StreamedResponse response;
    try {
      response = await _client.send(request).timeout(connectTimeout);
    } on TimeoutException catch (error) {
      cancellation.cancel();
      throw AppException(
        const AppFailure(
          kind: FailureKind.timeout,
          code: 'chat_connect_timeout',
          message: 'The chat service did not respond in time.',
          isRetryable: true,
        ),
        cause: error,
      );
    } on http.ClientException catch (error) {
      throw AppException(
        const AppFailure(
          kind: FailureKind.unavailable,
          code: 'chat_service_unavailable',
          message: 'The chat service could not be reached.',
          isRetryable: true,
        ),
        cause: error,
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final errorCode = await _readErrorCode(response.stream);
      throw AppException(_failureForStatus(response.statusCode, errorCode));
    }
    if (!(response.headers['content-type']
            ?.toLowerCase()
            .startsWith('text/event-stream') ??
        false)) {
      await response.stream.listen((_) {}).cancel();
      throw const AppException(
        AppFailure(
          kind: FailureKind.server,
          code: 'invalid_stream_response',
          message: 'The chat service returned an unsupported response.',
        ),
      );
    }
    if (response.contentLength != null &&
        response.contentLength! > maximumStreamBytes) {
      await response.stream.listen((_) {}).cancel();
      throw const AppException(
        AppFailure(
          kind: FailureKind.server,
          code: 'stream_limit_exceeded',
          message: 'The chat response exceeded its size limit.',
        ),
      );
    }

    var receivedBytes = 0;
    final limitedStream = response.stream.timeout(idleTimeout).transform(
      StreamTransformer<List<int>, List<int>>.fromHandlers(
        handleData: (chunk, sink) {
          receivedBytes += chunk.length;
          if (receivedBytes > maximumStreamBytes) {
            sink.addError(
              const AppException(
                AppFailure(
                  kind: FailureKind.server,
                  code: 'stream_limit_exceeded',
                  message: 'The chat response exceeded its size limit.',
                ),
              ),
            );
            sink.close();
          } else {
            sink.add(chunk);
          }
        },
      ),
    );

    try {
      await for (final event in SseStreamDecoder.decode(limitedStream)) {
        cancellation.throwIfCancelled();
        if (event.data.length > maximumStreamBytes) {
          throw const AppException(
            AppFailure(
              kind: FailureKind.server,
              code: 'stream_event_too_large',
              message: 'The chat service returned an oversized stream event.',
            ),
          );
        }
        final StreamChunkEntity chunk;
        try {
          chunk = StreamChunkModel.fromEventData(event.data).toEntity();
        } on FormatException catch (error) {
          throw AppException(
            const AppFailure(
              kind: FailureKind.server,
              code: 'invalid_chat_stream_event',
              message: 'The chat service returned an invalid stream event.',
            ),
            cause: error,
          );
        }
        if (chunk.content.isNotEmpty || chunk.isComplete) yield chunk;
        if (chunk.isComplete) return;
      }
    } on TimeoutException catch (error) {
      cancellation.cancel();
      throw AppException(
        const AppFailure(
          kind: FailureKind.timeout,
          code: 'chat_stream_timeout',
          message: 'The chat response stopped arriving. Try again.',
          isRetryable: true,
        ),
        cause: error,
      );
    } on http.ClientException catch (error) {
      if (cancellation.isCancelled) rethrow;
      throw AppException(
        const AppFailure(
          kind: FailureKind.unavailable,
          code: 'chat_stream_disconnected',
          message: 'The chat response was interrupted. Try again.',
          isRetryable: true,
        ),
        cause: error,
      );
    }
  }

  Future<String?> _readErrorCode(Stream<List<int>> stream) async {
    const maximumErrorBytes = 8 * 1024;
    final bytes = BytesBuilder(copy: false);
    var byteCount = 0;
    await for (final chunk in stream) {
      if (byteCount + chunk.length > maximumErrorBytes) break;
      bytes.add(chunk);
      byteCount += chunk.length;
    }
    try {
      final payload = jsonDecode(utf8.decode(bytes.takeBytes()));
      if (payload is Map<String, dynamic> &&
          payload['error'] is Map<String, dynamic>) {
        final error = payload['error'] as Map<String, dynamic>;
        final code = error['code'];
        if (code is String && code.length <= 80) return code;
      }
    } on FormatException {
      return null;
    }
    return null;
  }

  AppFailure _failureForStatus(int statusCode, String? errorCode) {
    if (statusCode == 401) {
      return const AppFailure(
        kind: FailureKind.unauthenticated,
        code: 'authentication_required',
        message: 'Sign in again to continue chatting.',
      );
    }
    if (statusCode == 429) {
      return const AppFailure(
        kind: FailureKind.rateLimited,
        code: 'rate_limited',
        message: 'You are sending messages too quickly. Try again shortly.',
        isRetryable: true,
      );
    }
    if (errorCode == 'ai_provider_not_configured') {
      return const AppFailure(
        kind: FailureKind.unavailable,
        code: 'ai_provider_not_configured',
        message: 'Add the AI provider key to the backend server environment. '
            'Do not put provider keys in the Flutter app.',
      );
    }
    return AppFailure(
      kind: statusCode >= 500 ? FailureKind.unavailable : FailureKind.server,
      code: 'chat_request_failed',
      message: 'The chat service could not complete this request.',
      isRetryable: statusCode >= 500,
    );
  }
}
