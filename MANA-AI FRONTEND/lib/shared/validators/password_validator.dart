import '../../core/constants/validation_constants.dart';

abstract final class PasswordValidator {
  static String? validate(String password) {
    if (password.length < ValidationConstants.minimumPasswordLength) {
      return 'Use at least ${ValidationConstants.minimumPasswordLength} characters.';
    }
    if (password.length > 128) return 'Password must be 128 characters or fewer.';
    if (password.trim() != password) {
      return 'Password cannot start or end with whitespace.';
    }
    return null;
  }
}
