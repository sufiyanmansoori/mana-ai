import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_endpoint.dart';
import '../constants/storage_constants.dart';
import '../storage/secure_key_value_store.dart';

final class DevelopmentApiSession {
  DevelopmentApiSession({
    required ApiEndpoint endpoint,
    required http.Client client,
    required SecureKeyValueStore secureStorage,
  })  : _endpoint = endpoint,
        _client = client,
        _secureStorage = secureStorage;

  static const _localSubject = 'mana-ai-local-development-user';
  static const _requestTimeout = Duration(seconds: 8);

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final SecureKeyValueStore _secureStorage;

  Future<List<String>> authenticateAndLoadModels() async {
    final tokenResponse = await _send(
      () => _client
          .post(
            _endpoint.resolve('v1/auth/dev-token'),
            headers: const {'content-type': 'application/json'},
            body: jsonEncode({'subject': _localSubject}),
          )
          .timeout(_requestTimeout),
    );
    if (tokenResponse.statusCode != 200) {
      throw DevelopmentApiException(
        tokenResponse.statusCode == 404
            ? 'The API does not allow local development sign-in.'
            : 'The API could not sign in the local development user '
                '(HTTP ${tokenResponse.statusCode}).',
      );
    }

    final tokenPayload = _decodeObject(tokenResponse.body);
    final accessToken = tokenPayload['access_token'];
    if (accessToken is! String || accessToken.trim().isEmpty) {
      throw const DevelopmentApiException(
        'The API returned an invalid sign-in response.',
      );
    }
    await _secureStorage.write(
      StorageConstants.accessTokenKey,
      accessToken,
    );

    final modelsResponse = await _send(
      () => _client.get(
        _endpoint.resolve('v1/models'),
        headers: {'authorization': 'Bearer $accessToken'},
      ).timeout(_requestTimeout),
    );
    if (modelsResponse.statusCode != 200) {
      throw DevelopmentApiException(
        'The API could not load its enabled models '
        '(HTTP ${modelsResponse.statusCode}).',
      );
    }

    final modelsPayload = _decodeObject(modelsResponse.body);
    final data = modelsPayload['data'];
    if (data is! List<Object?>) {
      throw const DevelopmentApiException(
        'The API returned an invalid model list.',
      );
    }
    final models = <String>{};
    for (final item in data) {
      if (item is! Map<String, dynamic>) {
        throw const DevelopmentApiException(
          'The API returned an invalid model list.',
        );
      }
      final id = item['id'];
      if (id is! String || !RegExp(r'^[A-Za-z0-9._:-]{1,128}$').hasMatch(id)) {
        throw const DevelopmentApiException(
          'The API returned an invalid model identifier.',
        );
      }
      models.add(id);
    }
    if (models.isEmpty) {
      throw const DevelopmentApiException(
        'No AI models are enabled on the API.',
      );
    }
    return List.unmodifiable(models);
  }

  Future<http.Response> _send(
    Future<http.Response> Function() request,
  ) async {
    try {
      return await request();
    } on TimeoutException {
      throw const DevelopmentApiException(
        'The Mana AI API did not respond in time.',
      );
    } on http.ClientException {
      throw const DevelopmentApiException(
        'The Mana AI API could not be reached. Start the backend and check '
        'API_BASE_URL.',
      );
    }
  }

  Map<String, dynamic> _decodeObject(String body) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) return decoded;
    } on FormatException {
      throw const DevelopmentApiException(
        'The API returned an invalid response.',
      );
    }
    throw const DevelopmentApiException(
      'The API returned an invalid response.',
    );
  }
}

final class DevelopmentApiException implements Exception {
  const DevelopmentApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
