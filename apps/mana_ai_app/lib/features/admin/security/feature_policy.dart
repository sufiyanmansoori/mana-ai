abstract final class AdminFeaturePolicy {
  static bool canAccess({
    required bool authenticated,
    required bool authorized,
  }) =>
      authenticated && authorized;
}
