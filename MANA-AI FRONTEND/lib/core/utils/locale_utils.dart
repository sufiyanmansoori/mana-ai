abstract final class LocaleUtils {
  static String languageTag(String languageCode, [String? countryCode]) {
    final language = languageCode.trim().toLowerCase();
    if (!RegExp(r'^[a-z]{2,3}$').hasMatch(language)) {
      throw ArgumentError.value(languageCode, 'languageCode');
    }
    final country = countryCode?.trim().toUpperCase();
    if (country == null || country.isEmpty) return language;
    if (!RegExp(r'^[A-Z]{2}$').hasMatch(country)) {
      throw ArgumentError.value(countryCode, 'countryCode');
    }
    return '$language-$country';
  }
}
