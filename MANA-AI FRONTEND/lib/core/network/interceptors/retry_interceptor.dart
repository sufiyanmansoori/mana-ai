import '../retry_policy.dart';

final class RetryInterceptor {
  const RetryInterceptor(this.policy);

  final RetryPolicy policy;

  bool shouldRetry({
    required int attempt,
    required bool idempotent,
    int? statusCode,
    bool networkFailure = false,
  }) =>
      policy.shouldRetry(
        retryNumber: attempt,
        isIdempotent: idempotent,
        statusCode: statusCode,
        networkFailure: networkFailure,
      );
}
