import 'dart:async';

import 'network_info.dart';
import 'network_status.dart';

final class ConnectivityService implements NetworkInfo {
  ConnectivityService({NetworkStatus initialStatus = NetworkStatus.unknown})
      : _controller = StreamController<NetworkStatus>.broadcast(),
        _status = initialStatus;

  final StreamController<NetworkStatus> _controller;
  NetworkStatus _status;
  bool _disposed = false;

  @override
  Future<NetworkStatus> get status async => _status;

  @override
  Stream<NetworkStatus> get changes => _controller.stream;

  void update(NetworkStatus status) {
    if (_disposed) throw StateError('ConnectivityService is disposed.');
    if (_status == status) return;
    _status = status;
    _controller.add(status);
  }

  Future<void> dispose() async {
    if (_disposed) return;
    _disposed = true;
    await _controller.close();
  }
}
