import 'package:flutter/material.dart';

final class LocaleProvider extends ChangeNotifier {
  LocaleProvider({Locale? initialLocale}) : _locale = initialLocale;

  Locale? _locale;

  Locale? get locale => _locale;

  void setLocale(Locale? locale) {
    if (_locale == locale) return;
    _locale = locale;
    notifyListeners();
  }
}
