import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'secure_key_value_store.dart';

final class PlatformSecureStorage implements SecureKeyValueStore {
  PlatformSecureStorage({
    FlutterSecureStorage storage = const FlutterSecureStorage(),
  }) : _storage = storage;

  final FlutterSecureStorage _storage;
  String? _cachedAccessToken;

  static const accessTokenKey = 'auth.access_token';

  @override
  String? readAccessTokenSync() => _cachedAccessToken;

  Future<void> initialize() async {
    _cachedAccessToken = await _storage.read(key: accessTokenKey);
  }

  @override
  Future<String?> read(String key) => _storage.read(key: _validateKey(key));

  @override
  Future<void> write(String key, String value) async {
    final validatedKey = _validateKey(key);
    await _storage.write(key: validatedKey, value: value);
    if (validatedKey == accessTokenKey) _cachedAccessToken = value;
  }

  @override
  Future<void> delete(String key) async {
    final validatedKey = _validateKey(key);
    await _storage.delete(key: validatedKey);
    if (validatedKey == accessTokenKey) _cachedAccessToken = null;
  }

  @override
  Future<void> deleteAll() async {
    await _storage.deleteAll();
    _cachedAccessToken = null;
  }

  String _validateKey(String key) {
    if (key.trim().isEmpty) throw ArgumentError.value(key, 'key');
    return key;
  }
}
