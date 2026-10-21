import '../error/error_reporter.dart';

abstract interface class CrashReporter implements ErrorReporter {
  Future<void> setUserIdentifier(String? identifier);
}

final class UnconfiguredCrashReporter implements CrashReporter {
  const UnconfiguredCrashReporter();

  @override
  Future<void> record(
    Object error,
    StackTrace stackTrace, {
    Map<String, Object?> context = const {},
  }) async {
    throw UnsupportedError(
      'Crash reporting provider has not been configured.',
    );
  }

  @override
  Future<void> setUserIdentifier(String? identifier) async {
    throw UnsupportedError(
      'Crash reporting provider has not been configured.',
    );
  }
}
