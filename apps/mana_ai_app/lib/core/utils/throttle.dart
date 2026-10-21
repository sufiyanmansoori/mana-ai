final class Throttle {
  Throttle(this.interval, {DateTime Function()? clock})
      : _clock = clock ?? DateTime.now {
    if (interval < Duration.zero) {
      throw ArgumentError.value(interval, 'interval');
    }
  }

  final Duration interval;
  final DateTime Function() _clock;
  DateTime? _lastRun;

  bool run(void Function() action) {
    final now = _clock();
    final lastRun = _lastRun;
    if (lastRun != null && now.difference(lastRun) < interval) return false;
    _lastRun = now;
    action();
    return true;
  }

  void reset() => _lastRun = null;
}
