import 'package:flutter/material.dart';

import 'color_palette.dart';
import 'radii.dart';
import 'theme_extensions.dart';
import 'typography.dart';

abstract final class ThemeDataFactory {
  static ThemeData create(Brightness brightness) {
    final scheme = ColorPalette.scheme(brightness);
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadii.medium),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      textTheme: AppTypography.forScheme(scheme),
      scaffoldBackgroundColor: scheme.surface,
      cardTheme: CardThemeData(shape: shape, elevation: 0),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surfaceContainerHighest.withAlpha(115),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.large),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.large),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.large),
          borderSide: BorderSide(color: scheme.primary),
        ),
      ),
      extensions: const [
        ManaThemeExtension(
          success: ColorPalette.success,
          warning: ColorPalette.warning,
          danger: ColorPalette.danger,
        ),
      ],
    );
  }
}
