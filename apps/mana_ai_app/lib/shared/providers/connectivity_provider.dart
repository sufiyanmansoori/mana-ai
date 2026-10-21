import 'package:flutter/foundation.dart';

import '../../core/network/network_info.dart';
import '../../core/network/network_status.dart';

final class ConnectivityProvider extends ChangeNotifier {
  ConnectivityProvider(this._networkInfo);

  final NetworkInfo _networkInfo;

  Future<NetworkStatus> get status => _networkInfo.status;

  Stream<NetworkStatus> get changes => _networkInfo.changes;
}
