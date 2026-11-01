abstract interface class BiometricService {
  Future<bool> isAvailable();

  Future<bool> authenticate({required String reason});
}