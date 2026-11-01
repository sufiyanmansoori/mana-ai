abstract interface class SpeechRecognitionService {
  Future<bool> isAvailable();

  Future<void> start({
    required String localeTag,
    required void Function(String partialText) onResult,
    required void Function(Object error) onError,
  });

  Future<void> stop();
}