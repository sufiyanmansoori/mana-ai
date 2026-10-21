abstract interface class AudioService {
  Future<void> initialize();

  Future<void> play(Uri source);

  Future<void> pause();

  Future<void> stop();

  Future<void> dispose();
}