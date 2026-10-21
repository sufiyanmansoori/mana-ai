import 'package:mana_ai_app/features/models/domain/entities/record.dart';

abstract interface class ModelsLocalDataSource {
  Future<List<ModelsRecord>> readAll();

  Future<ModelsRecord?> getById(String id);

  Future<void> save(ModelsRecord record);

  Future<void> delete(String id);
}
