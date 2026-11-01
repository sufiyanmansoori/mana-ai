import 'package:flutter/material.dart';

abstract final class AppTypography {
  static TextTheme forScheme(ColorScheme scheme) =>
      Typography.material2021().black.apply(
            bodyColor: scheme.onSurface,
            displayColor: scheme.onSurface,
          );
}
