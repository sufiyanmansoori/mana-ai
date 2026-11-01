final class NetworkException implements Exception {
  const NetworkException({
    required this.message,
    this.statusCode,
    this.requestId,
    this.isRetryable = false,
  });

  final String message;
  final int? statusCode;
  final String? requestId;
  final bool isRetryable;

  @override
  String toString() => 'NetworkException(statusCode: $statusCode)';
}
