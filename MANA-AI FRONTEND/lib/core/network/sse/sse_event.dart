final class SseEvent {
  const SseEvent({
    required this.data,
    this.event = 'message',
    this.id,
    this.retry,
  });

  final String data;
  final String event;
  final String? id;
  final Duration? retry;
}