import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/network/development_api_session.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';

void main() {
  test('authenticates locally, stores the token, and loads enabled models',
      () async {
    final storage = _TestSecureStorage();
    final client = MockClient((request) async {
      if (request.method == 'POST') {
        expect(request.url.path, '/v1/auth/dev-token');
        expect(
          jsonDecode(request.body),
          {'subject': 'mana-ai-local-development-user'},
        );
        return http.Response(
          jsonEncode({'access_token': 'test-token'}),
          200,
        );
      }

      expect(request.method, 'GET');
      expect(request.url.path, '/v1/models');
      expect(request.headers['authorization'], 'Bearer test-token');
      return http.Response(
        jsonEncode({
          'data': [
            {'id': 'model-one'},
            {'id': 'model-two'},
          ],
        }),
        200,
      );
    });

    final models = await DevelopmentApiSession(
      endpoint: ApiEndpoint('http://127.0.0.1:3000'),
      client: client,
      secureStorage: storage,
    ).authenticateAndLoadModels();

    expect(models, ['model-one', 'model-two']);
    expect(storage.values['auth.access_token'], 'test-token');
    client.close();
  });

  test('fails clearly when the backend has no enabled models', () async {
    final client = MockClient((request) async {
      if (request.method == 'POST') {
        return http.Response(
          jsonEncode({'access_token': 'test-token'}),
          200,
        );
      }
      return http.Response(jsonEncode({'data': []}), 200);
    });

    await expectLater(
      DevelopmentApiSession(
        endpoint: ApiEndpoint('http://127.0.0.1:3000'),
        client: client,
        secureStorage: _TestSecureStorage(),
      ).authenticateAndLoadModels(),
      throwsA(isA<DevelopmentApiException>()),
    );
    client.close();
  });
}

final class _TestSecureStorage implements SecureKeyValueStore {
  final values = <String, String>{};

  @override
  String? readAccessTokenSync() => values['auth.access_token'];

  @override
  Future<String?> read(String key) async => values[key];

  @override
  Future<void> write(String key, String value) async {
    values[key] = value;
  }

  @override
  Future<void> delete(String key) async {
    values.remove(key);
  }

  @override
  Future<void> deleteAll() async {
    values.clear();
  }
}
