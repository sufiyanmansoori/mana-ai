abstract final class ModelsFeaturePolicy {
  static bool canAccess({
    required bool authenticated,
    required bool authorized,
  }) =>
      authenticated && authorized;
}
