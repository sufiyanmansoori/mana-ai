import '../constants/app_constants.dart';

abstract final class InputValidator {
  static String normalizeChatMessage(
    String value, {
    int maximumLength = AppConstants.maximumChatMessageLength,
  }) {
    final normalized = value.trim();
    if (normalized.isEmpty) {
      throw const FormatException('Message cannot be empty.');
    }
    if (normalized.runes.length > maximumLength) {
      throw FormatException(
        'Message cannot exceed $maximumLength characters.',
      );
    }
    if (normalized.runes.any(
      (rune) =>
          (rune < 0x20 && rune != 0x09 && rune != 0x0A && rune != 0x0D) ||
          rune == 0x7F,
    )) {
      throw const FormatException(
        'Message contains unsupported control characters.',
      );
    }
    return normalized;
  }
}