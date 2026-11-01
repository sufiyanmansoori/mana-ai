import 'package:flutter/widgets.dart';

final class AppLifecycleProvider extends ChangeNotifier
    with WidgetsBindingObserver {
  AppLifecycleProvider() {
    WidgetsBinding.instance.addObserver(this);
  }

  AppLifecycleState _state = AppLifecycleState.resumed;

  AppLifecycleState get state => _state;

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_state == state) return;
    _state = state;
    notifyListeners();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}
