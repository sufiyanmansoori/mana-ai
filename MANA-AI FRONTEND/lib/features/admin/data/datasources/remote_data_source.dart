import 'dart:async';
import 'dart:typed_data';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';
import 'package:mana_ai_app/features/admin/data/mappers/record_mapper.dart';
import 'package:mana_ai_app/features/admin/data/models/record_model.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

abstract interface class AdminRemoteDataSource {
  Future<PaginatedResult<AdminRecord>> list(
    PageCursor cursor,
  );

  Future<AdminRecord?> getById(String id);

  Future<void> save(AdminRecord record);

  Future<void> delete(String id);
}

final class HttpAdminRemoteDataSource implements AdminRemoteDataSource {
  HttpAdminRemoteDataSource({
    required ApiEndpoint endpoint,
    required http.Client client,
    required SecureKeyValueStore secureStorage,
    this.resourcePath = 'v1/admin/records',
    this.requestTimeout = const Duration(seconds: 12),
    this.maximumResponseBytes = 1024 * 1024,
  })  : _endpoint = endpoint,
        _client = client,
        _secureStorage = secureStorage {
    if (requestTimeout <= Duration.zero) {
      throw ArgumentError.value(requestTimeout, 'requestTimeout');
    }
    if (maximumResponseBytes < 1) {
      throw ArgumentError.value(maximumResponseBytes, 'maximumResponseBytes');
    }
    _endpoint.resolve(resourcePath);
  }

  static final _controlCharacters = RegExp(r'[\u0000-\u001F\u007F]');

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final SecureKeyValueStore _secureStorage;
  final String resourcePath;
  final Duration requestTimeout;
  final int maximumResponseBytes;

  @override
  Future<PaginatedResult<AdminRecord>> list(PageCursor cursor) async {
    final payload = await _request(
      'GET',
      resourcePath,
      queryParameters: cursor.toQueryParameters(),
    );
    final data = payload['data'];
    if (data is! List<Object?>) {
      throw const AdminRemoteDataSourceException(
        'The admin service returned an invalid record list.',
      );
    }

    final models = <AdminRecordModel>[];
    for (final item in data) {
      models.add(AdminRecordModel.fromJson(_asObject(item)));
    }
    final nextCursor = payload['next_cursor'];
    if (nextCursor != null &&
        (nextCursor is! String ||
            nextCursor.isEmpty ||
            nextCursor.length > 512)) {
      throw const AdminRemoteDataSourceException(
        'The admin service returned an invalid page cursor.',
      );
    }
    return PaginatedResult(
      items: AdminRecordMapper.fromModels(models),
      nextCursor: nextCursor == null
          ? null
          : PageCursor(token: nextCursor, limit: cursor.limit),
    );
  }

  @override
  Future<AdminRecord?> getById(String id) async {
    final normalizedId = _normalizeId(id);
    try {
      final payload = await _request(
        'GET',
        '$resourcePath/${Uri.encodeComponent(normalizedId)}',
      );
      return AdminRecordMapper.fromModel(
        AdminRecordModel.fromJson(_asObject(payload['data'])),
      );
    } on AdminRemoteDataSourceException catch (error) {
      if (error.statusCode == 404) return null;
      rethrow;
    }
  }

  @override
  Future<void> save(AdminRecord record) async {
    final model = AdminRecordMapper.toModel(
      AdminRecord(
        id: _normalizeId(record.id),
        createdAt: record.createdAt.toUtc(),
      ),
    );
    await _request(
      'PUT',
      '$resourcePath/${Uri.encodeComponent(model.id)}',
      body: {
        'createdAt': model.createdAt.toUtc().toIso8601String(),
      },
      expectBody: false,
    );
  }

  @override
  Future<void> delete(String id) async {
    await _request(
      'DELETE',
      '$resourcePath/${Uri.encodeComponent(_normalizeId(id))}',
      expectBody: false,
    );
  }

  Future<Map<String, dynamic>> _request(
    String method,
    String path, {
    Map<String, String> queryParameters = const {},
    Map<String, Object?>? body,
    bool expectBody = true,
  }) async {
    final token = _secureStorage.readAccessTokenSync() ??
        await _secureStorage.read('auth.access_token');
    if (token == null || token.trim().isEmpty) {
      throw const AdminRemoteDataSourceException(
        'Sign in to an administrator account to manage records.',
      );
    }

    final baseUri = _endpoint.resolve(path);
    final uri = baseUri.replace(
      queryParameters: queryParameters.isEmpty ? null : queryParameters,
    );
    final request = http.Request(method, uri)
      ..headers.addAll({
        'accept': 'application/json',
        'authorization': '******',
        if (body != null) 'content-type': 'application/json',
      });
    if (body != null) request.body = jsonEncode(body);

    late final http.Response response;
    try {
      final streamed = await _client.send(request).timeout(requestTimeout);
      final responseBytes = BytesBuilder(copy: false);
      var bytesRead = 0;
      await for (final chunk in streamed.stream.timeout(requestTimeout)) {
        bytesRead += chunk.length;
        if (bytesRead > maximumResponseBytes) {
          throw const AdminRemoteDataSourceException(
            'The admin service response exceeded its size limit.',
          );
        }
        responseBytes.add(chunk);
      }
      response = http.Response.bytes(
        responseBytes.takeBytes(),
        streamed.statusCode,
        request: request,
        headers: streamed.headers,
        isRedirect: streamed.isRedirect,
        persistentConnection: streamed.persistentConnection,
        reasonPhrase: streamed.reasonPhrase,
      );
    } on TimeoutException {
      throw const AdminRemoteDataSourceException(
        'The admin service timed out. Please retry.',
      );
    } on http.ClientException {
      throw const AdminRemoteDataSourceException(
        'The admin service could not be reached.',
      );
    }

    if (response.bodyBytes.length > maximumResponseBytes) {
      throw const AdminRemoteDataSourceException(
        'The admin service response exceeded its size limit.',
      );
    }
    if (response.statusCode == 401) {
      throw const AdminRemoteDataSourceException(
        'Your session expired. Sign in again to continue.',
        statusCode: 401,
      );
    }
    if (response.statusCode == 403) {
      throw const AdminRemoteDataSourceException(
        'This account is not authorized to manage admin records.',
        statusCode: 403,
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AdminRemoteDataSourceException(
        response.statusCode == 404
            ? 'The requested admin record was not found.'
            : response.statusCode == 409
                ? 'An admin record with this ID already exists.'
                : 'The admin service rejected the request '
                    '(HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }
    if (!expectBody) return const {};

    try {
      final decoded = jsonDecode(utf8.decode(response.bodyBytes));
      if (decoded is Map<String, dynamic>) return decoded;
    } on FormatException {
      throw const AdminRemoteDataSourceException(
        'The admin service returned an invalid response.',
      );
    }
    throw const AdminRemoteDataSourceException(
      'The admin service returned an invalid response.',
    );
  }

  Map<String, Object?> _asObject(Object? value) {
    if (value is Map<String, dynamic>) return value;
    throw const FormatException('Expected an admin record JSON object.');
  }

  String _normalizeId(String id) {
    final normalizedId = id.trim();
    if (normalizedId.isEmpty ||
        normalizedId.length > 128 ||
        _controlCharacters.hasMatch(normalizedId)) {
      throw ArgumentError.value(
        id,
        'id',
        'Record IDs must contain 1–128 printable characters.',
      );
    }
    return normalizedId;
  }
}

final class AdminRemoteDataSourceException implements Exception {
  const AdminRemoteDataSourceException(
    this.message, {
    this.statusCode,
  });

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}
