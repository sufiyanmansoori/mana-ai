import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

abstract interface class AdminLocalDataSource {
  Future<List<AdminRecord>> readAll();

  Future<AdminRecord?> getById(String id);

  Future<void> save(AdminRecord record);

  Future<void> delete(String id);
}
