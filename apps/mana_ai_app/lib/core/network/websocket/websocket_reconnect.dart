import '../retry_policy.dart';

final class WebSocketReconnect {
  WebSocketReconnect({RetryPolicy? retryPolicy})
      : _retryPolicy = retryPolicy ?? RetryPolicy(maxRetries: 5);

  final RetryPolicy _retryPolicy;

  bool shouldReconnect(int attempt) => _retryPolicy.shouldRetry(
        retryNumber: attempt,
        isIdempotent: true,
        networkFailure: true,
      );

  Duration delayFor(int attempt) => _retryPolicy.delayFor(attempt);
}
