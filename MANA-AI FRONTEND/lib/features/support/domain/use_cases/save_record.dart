import 'package:mana_ai_app/features/support/domain/entities/record.dart';
import 'package:mana_ai_app/features/support/domain/repositories/feature_repository.dart';

final class SupportSaveRecord {
  const SupportSaveRecord(this._repository);

  final SupportFeatureRepository _repository;

  Future<void> call(SupportRecord record) => _repository.save(record);
}
