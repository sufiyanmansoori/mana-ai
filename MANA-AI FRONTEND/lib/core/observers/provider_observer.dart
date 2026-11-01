import 'package:flutter/foundation.dart';

final class ProviderObserver extends ChangeNotifier {
  int _revision = 0;

  int get revision => _revision;

  void notifyChanged() {
    _revision++;
    notifyListeners();
  }
}
