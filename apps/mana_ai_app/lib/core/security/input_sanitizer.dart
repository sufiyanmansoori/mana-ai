import 'input_validator.dart';

abstract final class InputSanitizer {
  static String plainText(String value, {int maximumLength = 16000}) =>
      InputValidator.normalizeChatMessage(
        value,
        maximumLength: maximumLength,
      );

  static String singleLine(String value, {int maximumLength = 256}) {
    final normalized = value.trim().replaceAll(RegExp(r'\s+'), ' ');
    if (normalized.isEmpty || normalized.runes.length > maximumLength) {
      throw const FormatException('The value is empty or too long.');
    }
    if (normalized.runes.any((rune) => rune < 0x20 || rune == 0x7f)) {
      throw const FormatException('The value contains control characters.');
    }
    return normalized;
  }
}
