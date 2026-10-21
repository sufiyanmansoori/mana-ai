import 'dart:async';

import '../network/network_info.dart';
import '../network/network_status.dart';

final class NetworkMonitoringService {
  NetworkMonitoringService(this._networkInfo);

  final NetworkInfo _networkInfo;
  StreamSubscription<NetworkStatus>? _subscription;
  NetworkStatus _current = NetworkStatus.unknown;

  NetworkStatus get current => _current;

  Future<void> start(void Function(NetworkStatus) onChanged) async {
    await stop();
    _current = await _networkInfo.status;
    onChanged(_current);
    _subscription = _networkInfo.changes.listen((status) {
      if (_current == status) return;
      _current = status;
      onChanged(status);
    });
  }

  Future<void> stop() async {
    await _subscription?.cancel();
    _subscription = null;
  }
}