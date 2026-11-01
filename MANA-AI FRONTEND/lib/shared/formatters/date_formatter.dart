import 'package:intl/intl.dart';

abstract final class DateFormatter {
  static String formatDateTime(DateTime value, {String? locale}) =>
      DateFormat.yMMMd(locale).add_jm().format(value.toLocal());

  static String formatDate(DateTime value, {String? locale}) =>
      DateFormat.yMMMd(locale).format(value.toLocal());
}
