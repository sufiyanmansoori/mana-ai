final class ValidationException implements Exception {
  const ValidationException({
    required this.field,
    required this.message,
  });

  final String field;
  final String message;

  @override
  String toString() => 'ValidationException($field)';
}
