import 'log_filter.dart';
import 'log_formatter.dart';
import 'log_level.dart';
import 'sensitive_log_filter.dart';

typedef LogWriter = void Function(String line);

final class AppLogger {
  AppLogger({
    required LogWriter writer,
    required Iterable<LogFilter> filters,
    LogFormatter formatter = const JsonLogFormatter(),
    DateTime Function()? clock,
  })  : _writer = writer,
        _filters = List.unmodifiable(filters),
        _formatter = formatter,
        _clock = clock ?? DateTime.now;

  final LogWriter _writer;
  final List<LogFilter> _filters;
  final LogFormatter _formatter;
  final DateTime Function() _clock;

  void log(
    LogLevel level,
    String message, {
    Map<String, Object?> fields = const {},
  }) {
    final safeMessage = SensitiveLogFilter.redact(message);
    if (!_filters.every((filter) => filter.allows(level, safeMessage))) return;
    _writer(
      _formatter.format(
        timestamp: _clock(),
        level: level,
        message: safeMessage,
        fields: SensitiveLogFilter.redactFields(fields),
      ),
    );
  }
}
