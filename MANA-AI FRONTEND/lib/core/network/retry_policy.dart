import 'dart:math' as math;

final class RetryPolicy {
  RetryPolicy({
    this.maxRetries = 3,
    this.baseDelay = const Duration(milliseconds: 300),
    this.maxDelay = const Duration(seconds: 8),
  }) {
    if (maxRetries < 0) {
      throw RangeError.value(maxRetries, 'maxRetries');
    }
    if (baseDelay.isNegative || maxDelay.isNegative || maxDelay < baseDelay) {
      throw ArgumentError('Retry delays must be non-negative and ordered.');
    }
  }

  final int maxRetries;
  final Duration baseDelay;
  final Duration maxDelay;

  bool shouldRetry({
    required int retryNumber,
    required bool isIdempotent,
    int? statusCode,
    bool networkFailure = false,
  }) {
    if (!isIdempotent || retryNumber >= maxRetries) return false;
    if (networkFailure) return true;
    return statusCode == 408 ||
        statusCode == 429 ||
        (statusCode != null && statusCode >= 500 && statusCode <= 599);
  }

  Duration delayFor(int retryNumber) {
    if (retryNumber < 1 || retryNumber > maxRetries) {
      throw RangeError.range(retryNumber, 1, maxRetries, 'retryNumber');
    }
    final multiplier = math.pow(2, retryNumber - 1).toInt();
    final microseconds = baseDelay.inMicroseconds * multiplier;
    return Duration(
      microseconds: math.min(microseconds, maxDelay.inMicroseconds),
    );
  }
}
