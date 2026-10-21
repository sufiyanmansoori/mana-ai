abstract final class DurationFormatter {
  static String clock(Duration value) {
    if (value.isNegative) throw ArgumentError.value(value, 'value');
    final seconds = value.inSeconds;
    final minutes = seconds ~/ 60;
    final remainder = seconds % 60;
    final hours = minutes ~/ 60;
    final remainingMinutes = minutes % 60;
    final secondsText = remainder.toString().padLeft(2, '0');
    if (hours == 0) {
      return '${remainingMinutes.toString().padLeft(2, '0')}:$secondsText';
    }
    return '$hours:${remainingMinutes.toString().padLeft(2, '0')}:$secondsText';
  }
}
