import 'dart:async';

final class RequestCancellation {
  final Completer<void> _completer = Completer<void>();

  bool get isCancelled => _completer.isCompleted;

  Future<void> get whenCancelled => _completer.future;

  void cancel() {
    if (!_completer.isCompleted) _completer.complete();
  }

  void throwIfCancelled() {
    if (isCancelled) throw const RequestCancelledException();
  }
}

final class RequestCancelledException implements Exception {
  const RequestCancelledException();

  @override
  String toString() => 'The request was cancelled.';
}
