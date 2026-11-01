import 'local_database.dart';
import 'migrations/schema_migration.dart';

final class DatabaseInitializer {
  DatabaseInitializer({
    required LocalDatabase database,
    required Iterable<SchemaMigration> migrations,
  })  : _database = database,
        _migrations = List.unmodifiable(migrations);

  final LocalDatabase _database;
  final List<SchemaMigration> _migrations;
  Future<void>? _initialization;

  Future<void> initialize() => _initialization ??= _openAndMigrate();

  Future<void> _openAndMigrate() async {
    try {
      await _database.open();
      await _database.migrate(_migrations);
    } catch (_) {
      _initialization = null;
      rethrow;
    }
  }
}
