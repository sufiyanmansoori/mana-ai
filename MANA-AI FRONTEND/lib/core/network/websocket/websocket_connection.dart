import 'dart:async';

import 'package:web_socket_channel/web_socket_channel.dart';

abstract interface class WebSocketConnector {
  WebSocketChannel connect(Uri uri);
}

final class WebSocketConnection {
  WebSocketConnection(this._connector);

  final WebSocketConnector _connector;
  WebSocketChannel? _channel;

  Stream<Object?> connect(Uri uri) {
    if (uri.scheme != 'wss' && uri.scheme != 'ws') {
      throw ArgumentError.value(uri, 'uri', 'Expected a ws:// or wss:// URI.');
    }
    disconnect();
    final channel = _connector.connect(uri);
    _channel = channel;
    return channel.stream;
  }

  void send(Object payload) {
    final channel = _channel;
    if (channel == null) throw StateError('WebSocket is not connected.');
    channel.sink.add(payload);
  }

  Future<void> disconnect([int? code, String? reason]) async {
    final channel = _channel;
    _channel = null;
    await channel?.sink.close(code, reason);
  }
}
