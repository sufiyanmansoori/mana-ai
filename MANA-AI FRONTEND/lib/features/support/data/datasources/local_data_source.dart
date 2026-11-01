import 'package:mana_ai_app/features/support/domain/entities/record.dart';

abstract interface class SupportLocalDataSource {
  Future<List<SupportRecord>> readAll();

  Future<SupportRecord?> getById(String id);

  Future<void> save(SupportRecord record);

  Future<void> delete(String id);
}
