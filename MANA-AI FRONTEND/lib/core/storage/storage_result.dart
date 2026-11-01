import '../foundation/app_failure.dart';

sealed class StorageResult<T> {
  const StorageResult();
}

final class StorageSuccess<T> extends StorageResult<T> {
  const StorageSuccess(this.value);

  final T value;
}

final class StorageFailure<T> extends StorageResult<T> {
  const StorageFailure(this.failure);

  final AppFailure failure;
}
