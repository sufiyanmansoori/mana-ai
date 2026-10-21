import 'package:flutter/foundation.dart';
import 'package:package_info_plus/package_info_plus.dart';

final class BuildInfo {
  const BuildInfo({
    required this.appName,
    required this.packageName,
    required this.version,
    required this.buildNumber,
    required this.isDebug,
  });

  final String appName;
  final String packageName;
  final String version;
  final String buildNumber;
  final bool isDebug;

  static Future<BuildInfo> load() async {
    final packageInfo = await PackageInfo.fromPlatform();
    return BuildInfo(
      appName: packageInfo.appName,
      packageName: packageInfo.packageName,
      version: packageInfo.version,
      buildNumber: packageInfo.buildNumber,
      isDebug: kDebugMode,
    );
  }
}
