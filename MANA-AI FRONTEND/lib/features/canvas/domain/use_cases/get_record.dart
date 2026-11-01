import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';
import 'package:mana_ai_app/features/canvas/domain/repositories/feature_repository.dart';

final class CanvasGetRecord {
  const CanvasGetRecord(this._repository);

  final CanvasFeatureRepository _repository;

  Future<CanvasRecord?> call(String id) => _repository.getById(id);
}
