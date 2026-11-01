import 'package:flutter/widgets.dart';

final class AppLifecycleObserver with WidgetsBindingObserver {
  AppLifecycleObserver(this.onStateChanged);

  final ValueChanged<AppLifecycleState> onStateChanged;
  bool _registered = false;

  void start() {
    if (_registered) return;
    WidgetsBinding.instance.addObserver(this);
    _registered = true;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    onStateChanged(state);
  }

  void dispose() {
    if (!_registered) return;
    WidgetsBinding.instance.removeObserver(this);
    _registered = false;
  }
}