enum FailureKind {
  validation,
  unauthenticated,
  forbidden,
  notFound,
  conflict,
  rateLimited,
  unavailable,
  timeout,
  cancelled,
  server,
  unknown,
}

final class AppFailure {
  const AppFailure({
    required this.kind,
    required this.message,
    this.code,
    this.isRetryable = false,
  });

  final FailureKind kind;
  final String message;
  final String? code;
  final bool isRetryable;
}