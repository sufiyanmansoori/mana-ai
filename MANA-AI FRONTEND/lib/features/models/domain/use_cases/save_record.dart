import 'package:mana_ai_app/features/models/domain/entities/record.dart';
import 'package:mana_ai_app/features/models/domain/repositories/feature_repository.dart';

final class ModelsSaveRecord {
  const ModelsSaveRecord(this._repository);

  final ModelsFeatureRepository _repository;

  Future<void> call(ModelsRecord record) => _repository.save(record);
}
