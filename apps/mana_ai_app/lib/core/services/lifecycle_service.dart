import 'package:flutter/widgets.dart';

final class LifecycleService with WidgetsBindingObserver {
  LifecycleService({required this.onStateChanged});

  final ValueChanged<AppLifecycleState> onStateChanged;
  bool _started = false;

  void start() {
    if (_started) return;
    WidgetsBinding.instance.addObserver(this);
    _started = true;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    onStateChanged(state);
  }

  void dispose() {
    if (!_started) return;
    WidgetsBinding.instance.removeObserver(this);
    _started = false;
  }
}