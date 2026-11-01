import 'dart:async';

import 'sse_client.dart';
import 'sse_event.dart';

final class SseConnection {
  SseConnection(this._client);

  final SseClient _client;
  StreamSubscription<SseEvent>? _subscription;
  Completer<void>? _abort;
  bool _disposed = false;

  Stream<SseEvent> connect({
    required String path,
    Map<String, String> queryParameters = const {},
    String? lastEventId,
  }) {
    if (_disposed) throw StateError('SSE connection is disposed.');
    disconnect();
    _abort = Completer<void>();
    return _client.connect(
      path: path,
      queryParameters: queryParameters,
      abortTrigger: _abort!.future,
      lastEventId: lastEventId,
    );
  }

  void attach(StreamSubscription<SseEvent> subscription) {
    if (_disposed) {
      unawaited(subscription.cancel());
      throw StateError('SSE connection is disposed.');
    }
    _subscription = subscription;
  }

  void disconnect() {
    if (_abort case final abort? when !abort.isCompleted) {
      abort.complete();
    }
    final subscription = _subscription;
    _subscription = null;
    if (subscription != null) unawaited(subscription.cancel());
  }

  void dispose() {
    if (_disposed) return;
    disconnect();
    _disposed = true;
  }
}
