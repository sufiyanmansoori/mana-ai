import 'package:mana_ai_app/features/settings/domain/entities/record.dart';
import 'package:mana_ai_app/features/settings/domain/repositories/feature_repository.dart';

final class SettingsGetRecord {
  const SettingsGetRecord(this._repository);

  final SettingsFeatureRepository _repository;

  Future<SettingsRecord?> call(String id) => _repository.getById(id);
}
