import 'package:flutter/material.dart';

import 'dark_theme.dart';
import 'light_theme.dart';

abstract final class AppTheme {
  static ThemeData get light => LightTheme.data;

  static ThemeData get dark => DarkTheme.data;
}
