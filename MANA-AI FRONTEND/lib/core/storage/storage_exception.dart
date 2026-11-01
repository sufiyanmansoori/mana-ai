final class StorageException implements Exception {
  const StorageException(this.operation, {this.cause});

  final String operation;
  final Object? cause;

  @override
  String toString() => 'StorageException(operation: $operation)';
}
