import 'log_level.dart';

abstract interface class LogFilter {
  bool allows(LogLevel level, String message);
}

final class MinimumLogLevelFilter implements LogFilter {
  const MinimumLogLevelFilter(this.minimum);

  final LogLevel minimum;

  @override
  bool allows(LogLevel level, String message) =>
      minimum != LogLevel.off && level.index >= minimum.index;
}
