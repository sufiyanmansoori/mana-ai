abstract final class MemoryFeaturePolicy {
  static bool canAccess({
    required bool authenticated,
    required bool authorized,
  }) =>
      authenticated && authorized;
}
