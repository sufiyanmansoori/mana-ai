import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';
import 'package:mana_ai_app/features/image_generation/data/datasources/image_generation_api_data_source.dart';

void main() {
  test('image datasource authenticates and returns generated image bytes',
      () async {
    final client = MockClient((request) async {
      expect(request.method, 'POST');
      expect(request.url.path, '/v1/images/generations');
      expect(request.headers['authorization'], 'Bearer test-token');
      expect(
        jsonDecode(request.body),
        {'prompt': 'A lake at sunrise.', 'size': '1024x1024'},
      );
      return http.Response(
        jsonEncode({
          'data': {
            'base64': 'aGVsbG8=',
            'mimeType': 'image/png',
            'revisedPrompt': 'A calm lake at sunrise.',
          },
        }),
        200,
      );
    });
    final dataSource = ImageGenerationApiDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      secureStorage: _FakeSecureStorage(),
    );

    final image = await dataSource.generate(
      prompt: '  A lake at sunrise.  ',
      size: '1024x1024',
    );

    expect(utf8.decode(image.bytes), 'hello');
    expect(image.mimeType, 'image/png');
    expect(image.revisedPrompt, 'A calm lake at sunrise.');
    client.close();
  });

  test('image datasource surfaces server-side provider setup errors', () async {
    final client = MockClient(
      (_) async => http.Response(
        jsonEncode({
          'error': {
            'code': 'image_provider_not_configured',
            'message': 'Add IMAGE_API_KEY to the backend environment.',
          },
        }),
        503,
      ),
    );
    final dataSource = ImageGenerationApiDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      secureStorage: _FakeSecureStorage(),
    );

    await expectLater(
      dataSource.generate(prompt: 'A lake at sunrise.', size: '1024x1024'),
      throwsA(
        isA<ImageGenerationApiException>().having(
          (error) => error.message,
          'message',
          contains('IMAGE_API_KEY'),
        ),
      ),
    );
    client.close();
  });
}

class _FakeSecureStorage implements SecureKeyValueStore {
  @override
  String? readAccessTokenSync() => 'test-token';

  @override
  Future<String?> read(String key) async => null;

  @override
  Future<void> write(String key, String value) async {}

  @override
  Future<void> delete(String key) async {}

  @override
  Future<void> deleteAll() async {}
}
