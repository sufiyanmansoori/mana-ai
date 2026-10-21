import 'package:flutter/material.dart';

abstract final class ColorPalette {
  static const seed = Color(0xFF6257D9);
  static const success = Color(0xFF287A48);
  static const warning = Color(0xFF9A5B00);
  static const danger = Color(0xFFB3261E);

  static ColorScheme scheme(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: brightness,
    );
    if (brightness == Brightness.light) return scheme;

    return scheme.copyWith(
      primary: const Color(0xFFB9A8FF),
      onPrimary: const Color(0xFF24165D),
      surface: const Color(0xFF090A0C),
      onSurface: const Color(0xFFE6E6E6),
      onSurfaceVariant: const Color(0xFFB8B8B8),
      surfaceContainerLowest: const Color(0xFF0D0E10),
      surfaceContainerLow: const Color(0xFF121315),
      surfaceContainer: const Color(0xFF191A1D),
      surfaceContainerHigh: const Color(0xFF202124),
      surfaceContainerHighest: const Color(0xFF292A2D),
      outline: const Color(0xFF555555),
      outlineVariant: const Color(0xFF303135),
      secondaryContainer: const Color(0xFF292A2D),
      onSecondaryContainer: const Color(0xFFE6E6E6),
    );
  }
}
