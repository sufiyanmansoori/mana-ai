abstract final class ProjectsFeaturePolicy {
  static bool canAccess({
    required bool authenticated,
    required bool authorized,
  }) =>
      authenticated && authorized;
}
