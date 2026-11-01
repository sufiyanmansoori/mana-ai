import 'package:mana_ai_app/features/models/domain/entities/record.dart';
import 'package:mana_ai_app/features/models/domain/repositories/feature_repository.dart';

final class ModelsGetRecord {
  const ModelsGetRecord(this._repository);

  final ModelsFeatureRepository _repository;

  Future<ModelsRecord?> call(String id) => _repository.getById(id);
}
