extension ManaStringExtensions on String {
  String get trimmed => trim();

  bool get isBlank => trim().isEmpty;

  String get firstCodePoint =>
      runes.isEmpty ? '' : String.fromCharCode(runes.first);
}
