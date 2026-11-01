import 'package:intl/intl.dart';

abstract final class FileSizeFormatter {
  static String format(int bytes, {String? locale, int decimals = 1}) {
    if (bytes < 0) throw RangeError.value(bytes, 'bytes');
    if (bytes < 1000) return '$bytes B';
    const units = ['kB', 'MB', 'GB', 'TB'];
    var value = bytes.toDouble();
    var unitIndex = -1;
    do {
      value /= 1000;
      unitIndex++;
    } while (value >= 1000 && unitIndex < units.length - 1);
    return '${NumberFormat.decimalPatternDigits(
      locale: locale,
      decimalDigits: decimals,
    ).format(value)} ${units[unitIndex]}';
  }
}
