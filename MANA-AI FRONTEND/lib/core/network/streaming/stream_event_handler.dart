import 'sse_event.dart';

abstract interface class StreamEventHandler {
  Future<void> onEvent(SseEvent event);

  Future<void> onComplete();

  Future<void> onError(Object error, StackTrace stackTrace);
}
