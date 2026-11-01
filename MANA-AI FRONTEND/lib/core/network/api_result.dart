import '../foundation/app_failure.dart';

sealed class ApiResult<T> {
  const ApiResult();

  R fold<R>({
    required R Function(T value) onSuccess,
    required R Function(AppFailure failure) onFailure,
  }) {
    return switch (this) {
      ApiSuccess<T>(:final value) => onSuccess(value),
      ApiError<T>(:final failure) => onFailure(failure),
    };
  }
}

final class ApiSuccess<T> extends ApiResult<T> {
  const ApiSuccess(this.value);

  final T value;
}

final class ApiError<T> extends ApiResult<T> {
  const ApiError(this.failure);

  final AppFailure failure;
}