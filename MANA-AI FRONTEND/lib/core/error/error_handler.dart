import '../foundation/app_failure.dart';
import 'error_mapper.dart';
import 'error_reporter.dart';

final class ErrorHandler {
  const ErrorHandler(this._reporter);

  final ErrorReporter _reporter;

  Future<AppFailure> handle(
    Object error,
    StackTrace stackTrace, {
    Map<String, Object?> context = const {},
  }) async {
    await _reporter.record(error, stackTrace, context: context);
    return ErrorMapper.from(error);
  }
}
