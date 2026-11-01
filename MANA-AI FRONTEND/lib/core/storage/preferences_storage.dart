import 'package:shared_preferences/shared_preferences.dart';

abstract interface class PreferencesStorage {
  Future<String?> readString(String key);

  Future<void> writeString(String key, String value);

  Future<bool?> readBool(String key);

  Future<void> writeBool(String key, bool value);

  Future<void> delete(String key);
}

final class PlatformPreferencesStorage implements PreferencesStorage {
  PlatformPreferencesStorage(this._preferences);

  final SharedPreferencesAsync _preferences;

  @override
  Future<String?> readString(String key) => _preferences.getString(key);

  @override
  Future<void> writeString(String key, String value) =>
      _preferences.setString(key, value);

  @override
  Future<bool?> readBool(String key) => _preferences.getBool(key);

  @override
  Future<void> writeBool(String key, bool value) =>
      _preferences.setBool(key, value);

  @override
  Future<void> delete(String key) => _preferences.remove(key);
}
