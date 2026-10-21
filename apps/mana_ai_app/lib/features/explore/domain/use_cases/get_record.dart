import 'package:mana_ai_app/features/explore/domain/entities/record.dart';
import 'package:mana_ai_app/features/explore/domain/repositories/feature_repository.dart';

final class ExploreGetRecord {
  const ExploreGetRecord(this._repository);

  final ExploreFeatureRepository _repository;

  Future<ExploreRecord?> call(String id) => _repository.getById(id);
}
