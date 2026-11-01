import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../../core/config/api_endpoint.dart';
import '../../../../core/storage/secure_key_value_store.dart';
import '../../domain/entities/feature_flag.dart';

abstract interface class AdminFeatureFlagsDataSource {
  Future<List<AdminFeatureFlag>> list();

  Future<List<AdminFeatureFlagAuditEntry>> listAudit();

  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  });

  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  });

  Future<void> delete(String key);
}

final class AdminFeatureFlagsApiDataSource
    implements AdminFeatureFlagsDataSource {
  AdminFeatureFlagsApiDataSource({
    required ApiEndpoint endpoint,
    required http.Client client,
    required SecureKeyValueStore secureStorage,
    this.requestTimeout = const Duration(seconds: 12),
  })  : _endpoint = endpoint,
        _client = client,
        _secureStorage = secureStorage {
    if (requestTimeout <= Duration.zero) {
      throw ArgumentError.value(requestTimeout, 'requestTimeout');
    }
  }

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final SecureKeyValueStore _secureStorage;
  final Duration requestTimeout;

  @override
  Future<List<AdminFeatureFlag>> list() async {
    final payload = await _request('GET', 'v1/admin/feature-flags');
    final data = payload['data'];
    if (data is! List<Object?>) {
      throw const AdminFeatureFlagsApiException(
        'The server returned an invalid feature flag list.',
      );
    }
    return List.unmodifiable([
      for (final item in data) AdminFeatureFlag.fromJson(_asObject(item)),
    ]);
  }

  @override
  Future<List<AdminFeatureFlagAuditEntry>> listAudit() async {
    final payload = await _request(
      'GET',
      'v1/admin/feature-flags/audit?limit=50',
    );
    final data = payload['data'];
    if (data is! List<Object?>) {
      throw const AdminFeatureFlagsApiException(
        'The server returned invalid feature flag audit data.',
      );
    }
    return List.unmodifiable([
      for (final item in data)
        AdminFeatureFlagAuditEntry.fromJson(_asObject(item)),
    ]);
  }

  @override
  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  }) async {
    final payload = await _request(
      'POST',
      'v1/admin/feature-flags',
      body: {
        'key': key,
        'description': description,
        'enabled': enabled,
      },
    );
    return AdminFeatureFlag.fromJson(_asObject(payload['data']));
  }

  @override
  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  }) async {
    final payload = await _request(
      'PATCH',
      'v1/admin/feature-flags/${Uri.encodeComponent(key)}',
      body: {'enabled': enabled},
    );
    return AdminFeatureFlag.fromJson(_asObject(payload['data']));
  }

  @override
  Future<void> delete(String key) async {
    await _request(
      'DELETE',
      'v1/admin/feature-flags/${Uri.encodeComponent(key)}',
      expectBody: false,
    );
  }

  Future<Map<String, dynamic>> _request(
    String method,
    String path, {
    Map<String, Object?>? body,
    bool expectBody = true,
  }) async {
    final token = _secureStorage.readAccessTokenSync() ??
        await _secureStorage.read('auth.access_token');
    if (token == null || token.trim().isEmpty) {
      throw const AdminFeatureFlagsApiException(
        'Sign in to an administrator account to manage feature flags.',
      );
    }

    final uri = _endpoint.resolve(path);
    late final http.Response response;
    try {
      final request = http.Request(method, uri)
        ..headers.addAll({
          'accept': 'application/json',
          'authorization': 'Bearer $token',
          if (body != null) 'content-type': 'application/json',
        });
      request.headers['authorization'] = 'Bearer ${token.trim()}';
      if (body != null) request.body = jsonEncode(body);
      final streamedResponse =
          await _client.send(request).timeout(requestTimeout);
      response = await http.Response.fromStream(streamedResponse)
          .timeout(requestTimeout);
    } on TimeoutException {
      throw const AdminFeatureFlagsApiException(
        'The admin service timed out. Please retry.',
      );
    } on http.ClientException {
      throw const AdminFeatureFlagsApiException(
        'The admin service could not be reached.',
      );
    }

    if (response.statusCode == 401) {
      throw const AdminFeatureFlagsApiException(
        'Your session expired. Sign in again to continue.',
      );
    }
    if (response.statusCode == 403) {
      throw const AdminFeatureFlagsApiException(
        'This account is not authorized to administer feature flags.',
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AdminFeatureFlagsApiException(
        response.statusCode == 404
            ? 'The requested feature flag was not found.'
            : response.statusCode == 409
                ? 'A feature flag with that key already exists.'
                : 'The admin service rejected the request '
                    '(HTTP ${response.statusCode}).',
      );
    }
    if (!expectBody) return const {};

    try {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) return decoded;
    } on FormatException {
      throw const AdminFeatureFlagsApiException(
        'The admin service returned an invalid response.',
      );
    }
    throw const AdminFeatureFlagsApiException(
      'The admin service returned an invalid response.',
    );
  }

  Map<String, Object?> _asObject(Object? value) {
    if (value is Map<String, dynamic>) return value;
    throw const FormatException('Expected a JSON object.');
  }
}

final class AdminFeatureFlagsApiException implements Exception {
  const AdminFeatureFlagsApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
