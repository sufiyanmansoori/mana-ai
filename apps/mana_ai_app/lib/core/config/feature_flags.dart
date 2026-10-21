abstract interface class FeatureFlags {
  bool isEnabled(String key, {bool defaultValue = false});
}

final class StaticFeatureFlags implements FeatureFlags {
  StaticFeatureFlags(Map<String, bool> flags)
      : _flags = Map.unmodifiable(flags);

  final Map<String, bool> _flags;

  @override
  bool isEnabled(String key, {bool defaultValue = false}) =>
      _flags[key] ?? defaultValue;
}
