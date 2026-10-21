import '../retry_policy.dart';

final class StreamRecovery {
  StreamRecovery({
    RetryPolicy? retryPolicy,
    Duration? maximumRecoveryWindow,
    DateTime Function()? clock,
  })  : retryPolicy = retryPolicy ?? RetryPolicy(),
        maximumRecoveryWindow =
            maximumRecoveryWindow ?? const Duration(minutes: 2),
        _clock = clock ?? DateTime.now {
    if (this.maximumRecoveryWindow <= Duration.zero) {
      throw ArgumentError.value(
        this.maximumRecoveryWindow,
        'maximumRecoveryWindow',
      );
    }
  }

  final RetryPolicy retryPolicy;
  final Duration maximumRecoveryWindow;
  final DateTime Function() _clock;
  DateTime? _startedAt;

  void begin() => _startedAt ??= _clock();

  bool get canRecover {
    final startedAt = _startedAt;
    return startedAt != null &&
        _clock().difference(startedAt) < maximumRecoveryWindow;
  }

  Duration delayFor(int attempt) => retryPolicy.delayFor(attempt);

  void reset() => _startedAt = null;
}
