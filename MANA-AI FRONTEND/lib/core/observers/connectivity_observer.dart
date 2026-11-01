import 'dart:async';

import '../network/network_info.dart';
import '../network/network_status.dart';

final class ConnectivityObserver {
  ConnectivityObserver(this._networkInfo);

  final NetworkInfo _networkInfo;
  StreamSubscription<NetworkStatus>? _subscription;

  Future<void> start(void Function(NetworkStatus) onChanged) async {
    await _subscription?.cancel();
    onChanged(await _networkInfo.status);
    _subscription = _networkInfo.changes.listen(onChanged);
  }

  Future<void> stop() async {
    await _subscription?.cancel();
    _subscription = null;
  }
}
