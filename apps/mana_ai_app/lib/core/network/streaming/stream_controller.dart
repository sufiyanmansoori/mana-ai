import 'dart:async';

import 'sse_event.dart';
import 'stream_event_handler.dart';
import 'stream_status.dart';

final class ManagedStreamController {
  ManagedStreamController(this._handler);

  final StreamEventHandler _handler;
  final StreamController<StreamStatus> _states =
      StreamController<StreamStatus>.broadcast();
  StreamSubscription<SseEvent>? _subscription;
  StreamStatus _status = StreamStatus.idle;
  bool _closed = false;

  Stream<StreamStatus> get states => _states.stream;

  StreamStatus get status => _status;

  Future<void> listen(Stream<SseEvent> stream) async {
    if (_closed) throw StateError('Stream controller is closed.');
    await _subscription?.cancel();
    _setStatus(StreamStatus.connecting);
    _subscription = stream.listen(
      (event) {
        _setStatus(StreamStatus.streaming);
        unawaited(_deliver(event));
      },
      onError: (Object error, StackTrace stackTrace) {
        unawaited(_fail(error, stackTrace));
      },
      onDone: () {
        unawaited(_complete());
      },
      cancelOnError: false,
    );
  }

  Future<void> _deliver(SseEvent event) async {
    try {
      await _handler.onEvent(event);
    } catch (error, stackTrace) {
      await _fail(error, stackTrace);
    }
  }

  Future<void> _complete() async {
    if (_closed) return;
    _setStatus(StreamStatus.completed);
    await _handler.onComplete();
  }

  Future<void> _fail(Object error, StackTrace stackTrace) async {
    if (_closed) return;
    _setStatus(StreamStatus.failed);
    await _handler.onError(error, stackTrace);
  }

  void _setStatus(StreamStatus status) {
    if (_status == status || _states.isClosed) return;
    _status = status;
    _states.add(status);
  }

  Future<void> close() async {
    if (_closed) return;
    _closed = true;
    await _subscription?.cancel();
    await _states.close();
  }
}
