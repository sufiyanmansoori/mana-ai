abstract interface class SchemaMigration {
  int get version;

  Future<void> apply();
}