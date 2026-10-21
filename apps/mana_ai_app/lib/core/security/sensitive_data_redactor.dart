abstract final class SensitiveDataRedactor {
  static final _bearerToken = RegExp(
    r'\bBearer\s+[A-Za-z0-9._~+/=-]+',
    caseSensitive: false,
  );
  static final _keyValueSecret = RegExp(
    r'\b(access_token|refresh_token|api[_-]?key|password)\s*[:=]\s*'
    r'["\x27]?[^"\x27\s,;]+',
    caseSensitive: false,
  );

  static String redact(String value) {
    return value
        .replaceAll(_bearerToken, 'Bearer [REDACTED]')
        .replaceAllMapped(
          _keyValueSecret,
          (match) => '${match[1]}=[REDACTED]',
        );
  }
}