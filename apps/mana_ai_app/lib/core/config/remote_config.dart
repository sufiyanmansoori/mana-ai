abstract interface class RemoteConfig {
  Future<void> refresh();

  bool getBool(String key, {required bool fallback});

  String getString(String key, {required String fallback});
}

final class UnavailableRemoteConfig implements RemoteConfig {
  const UnavailableRemoteConfig();

  @override
  Future<void> refresh() async {
    throw UnsupportedError('Remote configuration has not been configured.');
  }

  @override
  bool getBool(String key, {required bool fallback}) => fallback;

  @override
  String getString(String key, {required String fallback}) => fallback;
}
