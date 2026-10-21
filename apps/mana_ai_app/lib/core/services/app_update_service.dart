final class AppUpdateInfo {
  const AppUpdateInfo({
    required this.currentVersion,
    required this.latestVersion,
    required this.isRequired,
  });

  final String currentVersion;
  final String latestVersion;
  final bool isRequired;
}

abstract interface class AppUpdateService {
  Future<AppUpdateInfo?> checkForUpdate();

  Future<void> openStore();
}