import 'package:mana_ai_app/features/settings/domain/entities/record.dart';

abstract interface class SettingsLocalDataSource {
  Future<List<SettingsRecord>> readAll();

  Future<SettingsRecord?> getById(String id);

  Future<void> save(SettingsRecord record);

  Future<void> delete(String id);
}
