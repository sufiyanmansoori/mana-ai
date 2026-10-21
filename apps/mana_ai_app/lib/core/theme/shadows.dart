import 'package:flutter/material.dart';

abstract final class AppShadows {
  static List<BoxShadow> subtle(ColorScheme scheme) => [
        BoxShadow(
          color: scheme.shadow.withAlpha(20),
          blurRadius: 12,
          offset: const Offset(0, 3),
        ),
      ];
}
