import 'dart:async';

import 'package:flutter/foundation.dart';

import 'websocket_connection.dart';
import 'websocket_reconnect.dart';
import 'websocket_status.dart';

final class WebSocketManager extends ChangeNotifier {
  WebSocketManager({
    required WebSocketConnection connection,
    WebSocketReconnect? reconnect,
  })  : _connection = connection,
        _reconnect = reconnect ?? WebSocketReconnect();

  final WebSocketConnection _connection;
  final WebSocketReconnect _reconnect;
  StreamSubscription<Object?>? _subscription;
  WebSocketStatus _status = WebSocketStatus.disconnected;
  bool _disposed = false;

  WebSocketStatus get status => _status;

  Stream<Object?>? get events => _events?.stream;
  StreamController<Object?>? _events;

  Future<void> connect(Uri uri) async {
    if (_disposed) throw StateError('WebSocket manager is disposed.');
    await disconnect();
    _events = StreamController<Object?>.broadcast();
    _setStatus(WebSocketStatus.connecting);
    try {
      _subscription = _connection.connect(uri).listen(
        (event) {
          _setStatus(WebSocketStatus.connected);
          _events?.add(event);
        },
        onError: (Object error, StackTrace stackTrace) {
          _setStatus(WebSocketStatus.failed);
          _events?.addError(error, stackTrace);
        },
        onDone: () => _setStatus(WebSocketStatus.disconnected),
      );
    } catch (_) {
      _setStatus(WebSocketStatus.failed);
      rethrow;
    }
  }

  bool shouldReconnect(int attempt) => _reconnect.shouldReconnect(attempt);

  Duration reconnectDelay(int attempt) => _reconnect.delayFor(attempt);

  void _setStatus(WebSocketStatus status) {
    if (_status == status) return;
    _status = status;
    notifyListeners();
  }

  Future<void> disconnect() async {
    await _subscription?.cancel();
    _subscription = null;
    await _connection.disconnect();
    await _events?.close();
    _events = null;
    if (!_disposed) _setStatus(WebSocketStatus.disconnected);
  }

  @override
  void dispose() {
    _disposed = true;
    unawaited(disconnect());
    super.dispose();
  }
}
