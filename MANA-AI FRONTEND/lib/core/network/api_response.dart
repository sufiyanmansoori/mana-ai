final class ApiResponse<T> {
  const ApiResponse({
    required this.statusCode,
    required this.headers,
    required this.data,
    required this.requestId,
  });

  final int statusCode;
  final Map<String, String> headers;
  final T data;
  final String requestId;
}
