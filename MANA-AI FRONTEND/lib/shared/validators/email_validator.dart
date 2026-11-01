abstract final class EmailValidator {
  static bool isValid(String input) {
    final value = input.trim();
    if (value.length > 254 || value.contains(RegExp(r'\s'))) return false;
    final at = value.lastIndexOf('@');
    if (at <= 0 || at != value.indexOf('@') || at == value.length - 1) {
      return false;
    }
    final local = value.substring(0, at);
    final domain = value.substring(at + 1);
    if (local.length > 64 || local.startsWith('.') || local.endsWith('.')) {
      return false;
    }
    final labels = domain.split('.');
    return labels.length >= 2 &&
        labels.every(
          (label) =>
              label.isNotEmpty &&
              label.length <= 63 &&
              !label.startsWith('-') &&
              !label.endsWith('-'),
        );
  }
}
