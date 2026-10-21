sealed class WebSocketEvent {
  const WebSocketEvent();
}

final class WebSocketConnected extends WebSocketEvent {
  const WebSocketConnected();
}

final class WebSocketDisconnected extends WebSocketEvent {
  const WebSocketDisconnected({this.reason});

  final String? reason;
}

final class WebSocketFailure extends WebSocketEvent {
  const WebSocketFailure(this.message);

  final String message;
}
