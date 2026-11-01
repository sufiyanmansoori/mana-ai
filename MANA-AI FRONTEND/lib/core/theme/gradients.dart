import 'package:flutter/material.dart';

abstract final class AppGradients {
  static LinearGradient primary(ColorScheme scheme) => LinearGradient(
        begin: AlignmentDirectional.topStart,
        end: AlignmentDirectional.bottomEnd,
        colors: [scheme.primary, scheme.tertiary],
      );
}
