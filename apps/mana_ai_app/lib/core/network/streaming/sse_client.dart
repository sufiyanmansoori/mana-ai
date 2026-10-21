import 'dart:async';

import 'package:http/http.dart' as http;

import '../../config/api_endpoint.dart';
import '../../error/app_exception.dart';
import '../../foundation/app_failure.dart';
import '../request_headers.dart';
import '../request_metadata.dart';
import '../../services/secure_id_generator.dart';
import '../sse/sse_event.dart';
import '../sse/sse_stream_decoder.dart';

final class SseClient {
  SseClient({
    required ApiEndpoint endpoint,
    required http.Client client,
    required RequestHeaders headers,
    SecureIdGenerator? idGenerator,
  })  : _endpoint = endpoint,
        _client = client,
        _headers = headers,
        _idGenerator = idGenerator ?? SecureIdGenerator();

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final RequestHeaders _headers;
  final SecureIdGenerator _idGenerator;

  Stream<SseEvent> connect({
    required String path,
    Map<String, String> queryParameters = const {},
    required Future<void> abortTrigger,
    String? lastEventId,
  }) async* {
    final uri = _endpoint.resolve(path).replace(
          queryParameters: queryParameters.isEmpty ? null : queryParameters,
        );
    final metadata = RequestMetadata(
      requestId: _idGenerator.nextUuid(),
      startedAt: DateTime.now().toUtc(),
    );
    final request = http.AbortableRequest(
      'GET',
      uri,
      abortTrigger: abortTrigger,
    );
    request.headers.addAll(
      _headers.build(
        metadata,
        base: {
          'accept': 'text/event-stream',
          if (lastEventId != null && lastEventId.isNotEmpty)
            'last-event-id': lastEventId,
        },
      ),
    );

    final response = await _client.send(request);
    if (response.statusCode != 200 ||
        !(response.headers['content-type']?.toLowerCase().startsWith(
                  'text/event-stream',
                ) ??
            false)) {
      await response.stream.drain<void>();
      throw AppException(
        AppFailure(
          kind: response.statusCode == 401
              ? FailureKind.unauthenticated
              : FailureKind.unavailable,
          code: 'stream_connection_failed',
          message: 'The live response stream could not be established.',
          isRetryable: response.statusCode >= 500,
        ),
      );
    }

    yield* SseStreamDecoder.decode(response.stream);
  }
}
