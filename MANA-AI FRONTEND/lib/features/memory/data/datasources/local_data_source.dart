import 'package:mana_ai_app/features/memory/domain/entities/record.dart';

abstract interface class MemoryLocalDataSource {
  Future<List<MemoryRecord>> readAll();

  Future<MemoryRecord?> getById(String id);

  Future<void> save(MemoryRecord record);

  Future<void> delete(String id);
}
