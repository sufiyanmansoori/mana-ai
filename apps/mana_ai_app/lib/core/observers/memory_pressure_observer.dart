import 'package:flutter/widgets.dart';

final class MemoryPressureObserver with WidgetsBindingObserver {
  MemoryPressureObserver(this._onPressure);

  final VoidCallback _onPressure;
  bool _isRegistered = false;

  void start() {
    if (_isRegistered) return;
    WidgetsBinding.instance.addObserver(this);
    _isRegistered = true;
  }

  @override
  void didHaveMemoryPressure() => _onPressure();

  void dispose() {
    if (!_isRegistered) return;
    WidgetsBinding.instance.removeObserver(this);
    _isRegistered = false;
  }
}
