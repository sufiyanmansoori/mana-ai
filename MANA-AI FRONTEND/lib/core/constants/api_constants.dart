abstract final class ApiConstants {
  static const defaultConnectTimeout = Duration(seconds: 10);
  static const defaultReceiveTimeout = Duration(seconds: 30);
  static const maximumResponseBytes = 8 * 1024 * 1024;
  static const requestIdHeader = 'x-request-id';
  static const authorizationHeader = 'authorization';
  static const contentTypeJson = 'application/json';
}
