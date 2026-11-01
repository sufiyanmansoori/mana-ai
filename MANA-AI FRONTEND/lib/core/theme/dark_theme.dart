import 'package:flutter/material.dart';

import 'theme_data_factory.dart';

abstract final class DarkTheme {
  static ThemeData get data => ThemeDataFactory.create(Brightness.dark);
}
