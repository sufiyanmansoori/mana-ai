import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';
import 'package:mana_ai_app/features/admin/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

void main() {
  group('HttpAdminRemoteDataSource', () {
    test('lists records and preserves the server pagination cursor', () async {
      final client = MockClient((request) async {
        expect(request.method, 'GET');
        expect(request.url.path, '/api/v1/admin/records');
        expect(request.url.queryParameters, {'limit': '10', 'cursor': 'next'});
        expect(request.headers['authorization'], '******');
        return _jsonResponse({
          'data': [
            {'id': 'record-1', 'createdAt': '2026-10-25T00:00:00Z'},
          ],
          'next_cursor': 'next-page',
        });
      });
      final source = _source(client);

      final page = await source.list(PageCursor(limit: 10, token: 'next'));

      expect(page.items.single.id, 'record-1');
      expect(page.nextCursor?.token, 'next-page');
      expect(page.nextCursor?.limit, 10);
      client.close();
    });

    test('returns null for a missing record and encodes its ID in the path',
        () async {
      final client = MockClient((request) async {
        expect(request.url.path, '/api/v1/admin/records/record%2Fone');
        return _jsonResponse(
          {
            'error': {'code': 'admin_record_not_found'},
          },
          statusCode: 404,
        );
      });
      final source = _source(client);

      expect(await source.getById('record/one'), isNull);
      client.close();
    });

    test('saves UTC timestamps with an authenticated PUT request', () async {
      final localTime = DateTime(2026, 10, 25, 12);
      final client = MockClient((request) async {
        expect(request.method, 'PUT');
        expect(request.url.path, '/api/v1/admin/records/record-1');
        expect(request.headers['authorization'], '******');
        expect(jsonDecode(request.body), {
          'createdAt': localTime.toUtc().toIso8601String(),
        });
        return _jsonResponse({
          'data': {
            'id': 'record-1',
            'createdAt': localTime.toUtc().toIso8601String(),
          },
        });
      });

      await _source(client).save(
        AdminRecord(id: 'record-1', createdAt: localTime),
      );
      client.close();
    });

    test('deletes an authenticated record and accepts an empty response',
        () async {
      final client = MockClient((request) async {
        expect(request.method, 'DELETE');
        expect(request.url.path, '/api/v1/admin/records/record-1');
        return http.Response('', 204);
      });

      await _source(client).delete('record-1');
      client.close();
    });

    test('rejects missing authentication before sending a request', () async {
      var requestCount = 0;
      final client = MockClient((_) async {
        requestCount++;
        return _jsonResponse({'data': []});
      });
      final source = HttpAdminRemoteDataSource(
        endpoint: ApiEndpoint('https://api.example.test'),
        client: client,
        secureStorage: const _TestSecureStorage(null),
      );

      await expectLater(
        source.list(PageCursor()),
        throwsA(isA<AdminRemoteDataSourceException>()),
      );
      expect(requestCount, 0);
      client.close();
    });

    test('maps authorization failures to safe actionable messages', () async {
      final client = MockClient(
        (_) async => _jsonResponse(
          const {},
          statusCode: 403,
        ),
      );
      final source = _source(client);

      await expectLater(
        source.list(PageCursor()),
        throwsA(
          isA<AdminRemoteDataSourceException>()
              .having((error) => error.statusCode, 'statusCode', 403)
              .having(
                (error) => error.message,
                'message',
                contains('not authorized'),
              ),
        ),
      );
      client.close();
    });

    test('rejects malformed records, cursors, and oversized responses',
        () async {
      final malformedClient = MockClient(
        (_) async => _jsonResponse({
          'data': [
            {'id': '', 'createdAt': 'not-a-date'},
          ],
          'next_cursor': null,
        }),
      );
      await expectLater(
        _source(malformedClient).list(PageCursor()),
        throwsA(isA<FormatException>()),
      );
      malformedClient.close();

      final oversizedClient = MockClient(
        (_) async => _jsonResponse({'data': []}),
      );
      await expectLater(
        HttpAdminRemoteDataSource(
          endpoint: ApiEndpoint('https://api.example.test'),
          client: oversizedClient,
          secureStorage: const _TestSecureStorage('test-token'),
          maximumResponseBytes: 1,
        ).list(PageCursor()),
        throwsA(isA<AdminRemoteDataSourceException>()),
      );
      oversizedClient.close();
    });

    test('reports request timeouts', () async {
      final client = MockClient((_) async {
        await Future<void>.delayed(const Duration(milliseconds: 30));
        return _jsonResponse({'data': []});
      });
      final source = HttpAdminRemoteDataSource(
        endpoint: ApiEndpoint('https://api.example.test'),
        client: client,
        secureStorage: const _TestSecureStorage('test-token'),
        requestTimeout: const Duration(milliseconds: 5),
      );

      await expectLater(
        source.list(PageCursor()),
        throwsA(isA<AdminRemoteDataSourceException>()),
      );
      client.close();
    });
  });
}

HttpAdminRemoteDataSource _source(http.Client client) =>
    HttpAdminRemoteDataSource(
      endpoint: ApiEndpoint('https://api.example.test/api'),
      client: client,
      secureStorage: const _TestSecureStorage('test-token'),
    );

http.Response _jsonResponse(
  Object body, {
  int statusCode = 200,
}) =>
    http.Response(
      jsonEncode(body),
      statusCode,
      headers: const {'content-type': 'application/json'},
    );

final class _TestSecureStorage implements SecureKeyValueStore {
  const _TestSecureStorage(this.token);

  final String? token;

  @override
  String? readAccessTokenSync() => token;

  @override
  Future<String?> read(String key) async => token;

  @override
  Future<void> write(String key, String value) async {}

  @override
  Future<void> delete(String key) async {}

  @override
  Future<void> deleteAll() async {}
}
