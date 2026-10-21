final class WebSocketMessage {
  const WebSocketMessage({
    required this.payload,
    this.id,
    this.type = 'message',
  });

  final Object? payload;
  final String? id;
  final String type;
}
