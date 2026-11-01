import 'dart:async';

import '../foundation/app_failure.dart';
import 'app_exception.dart';

abstract final class ErrorMapper {
  static AppFailure from(Object error) {
    if (error is AppException) return error.failure;
    if (error is TimeoutException) {
      return const AppFailure(
        kind: FailureKind.timeout,
        message: 'The request timed out. Please try again.',
        isRetryable: true,
      );
    }
    if (error is FormatException || error is ArgumentError) {
      return AppFailure(
        kind: FailureKind.validation,
        message: error is FormatException
            ? error.message
            : 'The provided value is invalid.',
      );
    }

    return const AppFailure(
      kind: FailureKind.unknown,
      message: 'An unexpected error occurred.',
    );
  }
}