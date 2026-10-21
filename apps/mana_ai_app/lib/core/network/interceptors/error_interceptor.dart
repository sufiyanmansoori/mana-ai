import '../../foundation/app_failure.dart';

abstract final class ErrorInterceptor {
  static AppFailure fromStatusCode(int statusCode, {String? code}) {
    final kind = switch (statusCode) {
      400 || 422 => FailureKind.validation,
      401 => FailureKind.unauthenticated,
      403 => FailureKind.forbidden,
      404 => FailureKind.notFound,
      409 => FailureKind.conflict,
      408 || 429 => FailureKind.rateLimited,
      >= 500 => FailureKind.server,
      _ => FailureKind.unknown,
    };
    final retryable =
        statusCode == 408 || statusCode == 429 || statusCode >= 500;
    return AppFailure(
      kind: kind,
      code: code,
      isRetryable: retryable,
      message: switch (kind) {
        FailureKind.validation => 'The request contains invalid data.',
        FailureKind.unauthenticated => 'Please sign in to continue.',
        FailureKind.forbidden => 'You are not allowed to do that.',
        FailureKind.notFound => 'The requested resource was not found.',
        FailureKind.conflict => 'The request conflicts with current data.',
        FailureKind.rateLimited => 'Too many requests. Please try again later.',
        FailureKind.server => 'The service is temporarily unavailable.',
        _ => 'The request could not be completed.',
      },
    );
  }
}
