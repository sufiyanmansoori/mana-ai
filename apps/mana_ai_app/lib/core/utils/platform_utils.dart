import 'package:flutter/foundation.dart';

abstract final class PlatformUtils {
  static bool get isWeb => kIsWeb;
  static TargetPlatform get targetPlatform => defaultTargetPlatform;

  static bool get isMobile =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  static bool get isDesktop =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.windows ||
          defaultTargetPlatform == TargetPlatform.macOS ||
          defaultTargetPlatform == TargetPlatform.linux);
}
