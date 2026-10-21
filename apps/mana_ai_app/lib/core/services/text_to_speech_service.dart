abstract interface class TextToSpeechService {
  Future<void> speak(String text, {String? localeTag});

  Future<void> stop();

  Future<void> setSpeechRate(double rate);
}