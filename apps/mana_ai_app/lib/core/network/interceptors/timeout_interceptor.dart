final class TimeoutInterceptor {
  const TimeoutInterceptor({
    this.connectTimeout = const Duration(seconds: 10),
    this.receiveTimeout = const Duration(seconds: 30),
  });

  final Duration connectTimeout;
  final Duration receiveTimeout;

  void validate() {
    if (connectTimeout <= Duration.zero || receiveTimeout <= Duration.zero) {
      throw ArgumentError('Network timeouts must be positive.');
    }
  }
}
