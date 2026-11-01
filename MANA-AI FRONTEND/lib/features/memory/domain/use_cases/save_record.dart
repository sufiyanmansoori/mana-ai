import 'package:mana_ai_app/features/memory/domain/entities/record.dart';
import 'package:mana_ai_app/features/memory/domain/repositories/feature_repository.dart';

final class MemorySaveRecord {
  const MemorySaveRecord(this._repository);

  final MemoryFeatureRepository _repository;

  Future<void> call(MemoryRecord record) => _repository.save(record);
}
