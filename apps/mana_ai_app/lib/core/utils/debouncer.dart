import 'dart:async';

final class Debouncer {
  Debouncer(this.delay);

  final Duration delay;
  Timer? _timer;
  bool _isDisposed = false;

  void run(void Function() action) {
    if (_isDisposed) {
      throw StateError('A disposed debouncer cannot schedule work.');
    }
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void cancel() {
    _timer?.cancel();
    _timer = null;
  }

  void dispose() {
    cancel();
    _isDisposed = true;
  }
}