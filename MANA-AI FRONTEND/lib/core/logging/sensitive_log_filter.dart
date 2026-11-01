import '../security/sensitive_data_redactor.dart';

abstract final class SensitiveLogFilter {
  static String redact(String message) =>
      SensitiveDataRedactor.redact(message);

  static Map<String, Object?> redactFields(
    Map<String, Object?> fields,
  ) {
    const sensitiveNames = {
      'authorization',
      'password',
      'access_token',
      'refresh_token',
      'api_key',
      'cookie',
    };
    final safeFields = <String, Object?>{};
    for (final entry in fields.entries) {
      final value = entry.value;
      safeFields[entry.key] = sensitiveNames.contains(entry.key.toLowerCase())
          ? '[REDACTED]'
          : value is String
              ? redact(value)
              : value;
    }
    return Map.unmodifiable(safeFields);
  }
}
