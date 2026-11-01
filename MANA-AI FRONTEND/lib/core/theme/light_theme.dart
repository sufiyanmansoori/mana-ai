import 'package:flutter/material.dart';

import 'theme_data_factory.dart';

abstract final class LightTheme {
  static ThemeData get data => ThemeDataFactory.create(Brightness.light);
}
