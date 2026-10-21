abstract interface class ErrorReporter {
  Future<void> record(
    Object error,
    StackTrace stackTrace, {
    Map<String, Object?> context = const {},
  });
}

final class UnconfiguredErrorReporter implements ErrorReporter {
  const UnconfiguredErrorReporter();

  @override
  Future<void> record(
    Object error,
    StackTrace stackTrace, {
    Map<String, Object?> context = const {},
  }) async {
    throw UnsupportedError('An error reporting provider is not configured.');
  }
}
