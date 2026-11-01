abstract final class StringUtils {
  static String? trimToNull(String value) {
    final trimmed = value.trim();
    return trimmed.isEmpty ? null : trimmed;
  }

  static String truncate(
    String value,
    int maximumRunes, {
    String suffix = '…',
  }) {
    if (maximumRunes < 0) {
      throw RangeError.value(maximumRunes, 'maximumRunes');
    }
    final runes = value.runes.toList(growable: false);
    if (runes.length <= maximumRunes) return value;
    if (maximumRunes == 0) return '';
    final suffixRunes = suffix.runes.toList(growable: false);
    final available = maximumRunes > suffixRunes.length
        ? maximumRunes - suffixRunes.length
        : maximumRunes;
    return String.fromCharCodes(runes.take(available)) +
        (maximumRunes > suffixRunes.length ? suffix : '');
  }
}
