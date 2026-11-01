import 'package:mana_ai_app/features/explore/domain/entities/record.dart';
import 'package:mana_ai_app/features/explore/domain/repositories/feature_repository.dart';

final class ExploreSaveRecord {
  const ExploreSaveRecord(this._repository);

  final ExploreFeatureRepository _repository;

  Future<void> call(ExploreRecord record) => _repository.save(record);
}
