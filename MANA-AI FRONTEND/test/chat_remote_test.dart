import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/error/app_exception.dart';
import 'package:mana_ai_app/core/foundation/app_failure.dart';
import 'package:mana_ai_app/core/network/interceptors/auth_interceptor.dart';
import 'package:mana_ai_app/core/network/request_cancellation.dart';
import 'package:mana_ai_app/core/network/request_headers.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';
import 'package:mana_ai_app/features/chat/data/datasources/chat_remote_datasource_impl.dart';
import 'package:mana_ai_app/features/chat/domain/entities/chat_message.dart';

void main() {
  test('posts authenticated context and parses streamed completion events',
      () async {
    final client = MockClient((request) async {
      expect(request.method, 'POST');
      expect(request.url.path, '/v1/chat/completions');
      expect(request.headers['authorization'], 'Bearer access-token');
      final payload = jsonDecode(request.body) as Map<String, dynamic>;
      expect(payload['model'], 'mana-small');
      expect(payload['stream'], isTrue);
      expect(payload['messages'], [
        {'role': 'user', 'content': 'Hello'},
      ]);
      return http.Response(
        'data: {"choices":[{"delta":{"content":"Hi"},"finish_reason":null}]}\n\n'
        'data: [DONE]\n\n',
        200,
        headers: {'content-type': 'text/event-stream; charset=utf-8'},
      );
    });
    final source = OpenAiCompatibleChatRemoteDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      headers: RequestHeaders(
        interceptors: [AuthInterceptor(_FakeSecureStorage())],
      ),
    );

    final chunks = await source
        .streamCompletion(
          model: 'mana-small',
          messages: [_userMessage()],
          cancellation: RequestCancellation(),
        )
        .toList();

    expect(chunks.map((chunk) => chunk.content), ['Hi', '']);
    expect(chunks.last.isComplete, isTrue);
    client.close();
  });

  test('maps unauthorized responses without exposing provider payloads',
      () async {
    final client = MockClient((request) async {
      return http.Response(
        '{"error":"sensitive provider details"}',
        401,
        headers: {'content-type': 'application/json'},
      );
    });
    final source = OpenAiCompatibleChatRemoteDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      headers: RequestHeaders(interceptors: []),
    );

    await expectLater(
      source
          .streamCompletion(
            model: 'mana-small',
            messages: [_userMessage()],
            cancellation: RequestCancellation(),
          )
          .toList(),
      throwsA(
        isA<AppException>().having(
          (error) => error.failure.kind,
          'failure kind',
          FailureKind.unauthenticated,
        ),
      ),
    );
    client.close();
  });

  test('explains when the backend has no AI provider key configured', () async {
    final client = MockClient((request) async {
      return http.Response(
        jsonEncode({
          'error': {
            'code': 'ai_provider_not_configured',
            'message': 'Provider credentials are not configured.',
          },
        }),
        503,
        headers: {'content-type': 'application/json'},
      );
    });
    final source = OpenAiCompatibleChatRemoteDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      headers: RequestHeaders(interceptors: []),
    );

    await expectLater(
      source
          .streamCompletion(
            model: 'mana-small',
            messages: [_userMessage()],
            cancellation: RequestCancellation(),
          )
          .toList(),
      throwsA(
        isA<AppException>().having(
          (error) => error.failure.message,
          'failure message',
          contains('backend server environment'),
        ),
      ),
    );
    client.close();
  });
}

ChatMessage _userMessage() => ChatMessage(
      id: 'user-1',
      role: ChatMessageRole.user,
      content: 'Hello',
      createdAt: DateTime.utc(2026, 1, 1),
    );

final class _FakeSecureStorage implements SecureKeyValueStore {
  @override
  String? readAccessTokenSync() => 'access-token';

  @override
  Future<void> delete(String key) async {}

  @override
  Future<void> deleteAll() async {}

  @override
  Future<String?> read(String key) async => null;

  @override
  Future<void> write(String key, String value) async {}
}
