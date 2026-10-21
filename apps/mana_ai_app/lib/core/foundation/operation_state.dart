import 'app_failure.dart';

sealed class OperationState<T> {
  const OperationState();
}

final class OperationInitial<T> extends OperationState<T> {
  const OperationInitial();
}

final class OperationLoading<T> extends OperationState<T> {
  const OperationLoading();
}

final class OperationSuccess<T> extends OperationState<T> {
  const OperationSuccess(this.value);

  final T value;
}

final class OperationFailed<T> extends OperationState<T> {
  const OperationFailed(this.failure);

  final AppFailure failure;
}