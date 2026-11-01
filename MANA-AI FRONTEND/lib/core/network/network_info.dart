import 'network_status.dart';

abstract interface class NetworkInfo {
  Future<NetworkStatus> get status;

  Stream<NetworkStatus> get changes;
}
