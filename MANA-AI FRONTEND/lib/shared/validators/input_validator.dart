import '../../core/security/input_validator.dart' as core;

abstract final class SharedInputValidator {
  static String? chatMessage(String? value) {
    try {
      core.InputValidator.normalizeChatMessage(value ?? '');
      return null;
    } on FormatException catch (error) {
      return error.message;
    }
  }
}
