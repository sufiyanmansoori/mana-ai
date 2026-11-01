abstract final class AppDateUtils {
  static DateTime utc(DateTime value) => value.toUtc();

  static String toRfc3339(DateTime value) => value.toUtc().toIso8601String();

  static DateTime? parseIso8601(String value) =>
      DateTime.tryParse(value)?.toUtc();

  static bool isSameDay(DateTime first, DateTime second) =>
      first.year == second.year &&
      first.month == second.month &&
      first.day == second.day;
}
