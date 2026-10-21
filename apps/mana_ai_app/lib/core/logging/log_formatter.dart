import 'dart:convert';

import 'log_level.dart';

abstract interface class LogFormatter {
  String format({
    required DateTime timestamp,
    required LogLevel level,
    required String message,
    required Map<String, Object?> fields,
  });
}

final class JsonLogFormatter implements LogFormatter {
  const JsonLogFormatter();

  @override
  String format({
    required DateTime timestamp,
    required LogLevel level,
    required String message,
    required Map<String, Object?> fields,
  }) {
    final record = <String, Object?>{
      'timestamp': timestamp.toUtc().toIso8601String(),
      'level': level.name,
      'message': message,
      ...fields,
    };
    return jsonEncode(record);
  }
}
