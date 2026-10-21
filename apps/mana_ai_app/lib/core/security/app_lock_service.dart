import 'dart:async';

import 'package:flutter/foundation.dart';

final class AppLockService extends ChangeNotifier {
  AppLockService({this.lockAfter = const Duration(minutes: 5)}) {
    if (lockAfter <= Duration.zero) {
      throw ArgumentError.value(lockAfter, 'lockAfter');
    }
  }

  final Duration lockAfter;
  Timer? _timer;
  bool _isLocked = false;

  bool get isLocked => _isLocked;

  void markUserActive() {
    _timer?.cancel();
    if (!_isLocked) {
      _timer = Timer(lockAfter, lock);
    }
  }

  void lock() {
    _timer?.cancel();
    _timer = null;
    if (_isLocked) return;
    _isLocked = true;
    notifyListeners();
  }

  void unlock() {
    if (!_isLocked) return;
    _isLocked = false;
    notifyListeners();
    markUserActive();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
