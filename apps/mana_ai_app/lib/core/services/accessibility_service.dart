import 'package:flutter/semantics.dart';
import 'package:flutter/widgets.dart';

abstract interface class AccessibilityService {
  Future<void> announce(
    BuildContext context,
    String message, {
    TextDirection? textDirection,
  });
}

final class PlatformAccessibilityService implements AccessibilityService {
  const PlatformAccessibilityService();

  @override
  Future<void> announce(
    BuildContext context,
    String message, {
    TextDirection? textDirection,
  }) async {
    if (message.trim().isEmpty) return;
    await SemanticsService.sendAnnouncement(
      View.of(context),
      message,
      textDirection ?? Directionality.of(context),
    );
  }
}