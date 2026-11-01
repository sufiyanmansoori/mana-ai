import 'package:flutter/services.dart';

abstract interface class HapticsService {
  Future<void> selection();

  Future<void> confirm();

  Future<void> alert();
}

final class PlatformHapticsService implements HapticsService {
  const PlatformHapticsService();

  @override
  Future<void> selection() => HapticFeedback.selectionClick();

  @override
  Future<void> confirm() => HapticFeedback.mediumImpact();

  @override
  Future<void> alert() => HapticFeedback.heavyImpact();
}