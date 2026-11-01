import '../config/build_info.dart';

abstract interface class DeviceInfoService {
  Future<BuildInfo> getBuildInfo();
}

final class PackageDeviceInfoService implements DeviceInfoService {
  const PackageDeviceInfoService();

  @override
  Future<BuildInfo> getBuildInfo() => BuildInfo.load();
}