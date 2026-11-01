import 'package:flutter/foundation.dart';

final class ShareFeatureController extends ChangeNotifier {
  bool _isLoading = false;
  Object? _error;

  bool get isLoading => _isLoading;
  Object? get error => _error;

  void setLoading(bool value) {
    if (_isLoading == value) return;
    _isLoading = value;
    if (value) _error = null;
    notifyListeners();
  }

  void reportError(Object error) {
    _error = error;
    _isLoading = false;
    notifyListeners();
  }

  void clearError() {
    if (_error == null) return;
    _error = null;
    notifyListeners();
  }
}
