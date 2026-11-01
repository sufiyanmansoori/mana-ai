extension ManaDateTimeExtensions on DateTime {
  DateTime get utc => toUtc();

  bool isSameCalendarDay(DateTime other) =>
      year == other.year && month == other.month && day == other.day;
}
