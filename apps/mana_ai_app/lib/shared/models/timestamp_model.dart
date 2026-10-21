final class TimestampModel {
  TimestampModel(DateTime value) : value = value.toUtc();

  final DateTime value;

  factory TimestampModel.fromJson(Object? json) {
    if (json is! String) {
      throw const FormatException('Timestamp must be an ISO-8601 string.');
    }
    final parsed = DateTime.tryParse(json);
    if (parsed == null) {
      throw const FormatException('Timestamp is not a valid ISO-8601 date.');
    }
    return TimestampModel(parsed);
  }

  String toJson() => value.toIso8601String();
}
