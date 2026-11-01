abstract final class TimeoutConstants {
  static const connection = Duration(seconds: 10);
  static const request = Duration(seconds: 30);
  static const streamingIdle = Duration(seconds: 60);
  static const gracefulShutdown = Duration(seconds: 10);
}
