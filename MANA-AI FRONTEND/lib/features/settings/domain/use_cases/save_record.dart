import 'package:mana_ai_app/features/settings/domain/entities/record.dart';
import 'package:mana_ai_app/features/settings/domain/repositories/feature_repository.dart';

final class SettingsSaveRecord {
  const SettingsSaveRecord(this._repository);

  final SettingsFeatureRepository _repository;

  Future<void> call(SettingsRecord record) => _repository.save(record);
}
