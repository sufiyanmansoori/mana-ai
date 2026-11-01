final class AdminRecordModel {
  const AdminRecordModel({required this.id, required this.createdAt});

  static const maximumIdLength = 128;
  static const maximumTimestampLength = 64;
  static final _idControlCharacters = RegExp(r'[\u0000-\u001F\u007F]');
  static final _timestampPattern = RegExp(
    r'^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})'
    r'(?:\.(\d{1,6}))?(?:Z|[+-]\d{2}:\d{2})$',
  );

  factory AdminRecordModel.fromJson(Map<String, Object?> json) {
    final rawId = json['id'];
    if (rawId is! String) {
      throw const FormatException('Record JSON field "id" must be a string.');
    }
    final id = _validatedId(rawId);

    final rawTimestamp = json['createdAt'];
    if (rawTimestamp is! String) {
      throw const FormatException(
        'Record JSON field "createdAt" must be a string.',
      );
    }
    final createdAt = _parseTimestamp(rawTimestamp);
    return AdminRecordModel(id: id, createdAt: createdAt);
  }

  final String id;
  final DateTime createdAt;

  Map<String, Object?> toJson() {
    final normalizedId = _validatedId(id);
    if (!_isValidDate(createdAt)) {
      throw ArgumentError.value(
        createdAt,
        'createdAt',
        'Must be a valid date.',
      );
    }
    return Map.unmodifiable({
      'id': normalizedId,
      'createdAt': createdAt.toUtc().toIso8601String(),
    });
  }

  static String _validatedId(String value) {
    final normalized = value.trim();
    if (normalized.isEmpty ||
        normalized.length > maximumIdLength ||
        _idControlCharacters.hasMatch(normalized)) {
      throw const FormatException(
        'Record ID must contain 1–128 printable characters.',
      );
    }
    return normalized;
  }

  static DateTime _parseTimestamp(String value) {
    if (value.length > maximumTimestampLength) {
      throw const FormatException('Record timestamp exceeds its size limit.');
    }
    final match = _timestampPattern.firstMatch(value);
    if (match == null) {
      throw const FormatException(
        'Record timestamp must be an ISO 8601 date-time with a timezone.',
      );
    }

    final year = int.parse(match[1]!);
    final month = int.parse(match[2]!);
    final day = int.parse(match[3]!);
    final hour = int.parse(match[4]!);
    final minute = int.parse(match[5]!);
    final second = int.parse(match[6]!);
    final calendarDate = DateTime.utc(year, month, day);
    if (calendarDate.year != year ||
        calendarDate.month != month ||
        calendarDate.day != day ||
        hour > 23 ||
        minute > 59 ||
        second > 59) {
      throw const FormatException('Record timestamp is not a valid date-time.');
    }

    final parsed = DateTime.tryParse(value);
    if (parsed == null || !_isValidDate(parsed)) {
      throw const FormatException('Record timestamp is not a valid date-time.');
    }
    return parsed;
  }

  static bool _isValidDate(DateTime value) =>
      value.millisecondsSinceEpoch.isFinite;
}
