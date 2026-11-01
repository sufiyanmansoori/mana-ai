import 'package:intl/intl.dart';

abstract final class NumberFormatter {
  static String decimal(num value, {String? locale}) =>
      NumberFormat.decimalPattern(locale).format(value);

  static String compact(num value, {String? locale}) =>
      NumberFormat.compact(locale: locale).format(value);
}
