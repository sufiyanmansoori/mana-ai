import 'package:mana_ai_app/features/memory/domain/entities/record.dart';
import 'package:mana_ai_app/features/memory/domain/repositories/feature_repository.dart';

final class MemoryGetRecord {
  const MemoryGetRecord(this._repository);

  final MemoryFeatureRepository _repository;

  Future<MemoryRecord?> call(String id) => _repository.getById(id);
}
