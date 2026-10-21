abstract final class SupportFeaturePolicy {
  static bool canAccess({
    required bool authenticated,
    required bool authorized,
  }) =>
      authenticated && authorized;
}
