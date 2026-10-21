import 'package:flutter/material.dart';

extension BuildContextManaExtensions on BuildContext {
  ThemeData get appTheme => Theme.of(this);

  ColorScheme get colors => appTheme.colorScheme;

  TextTheme get textStyles => appTheme.textTheme;

  MediaQueryData get media => MediaQuery.of(this);

  bool get isCompactWidth => media.size.width < 600;
}
