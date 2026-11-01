import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';
import 'package:mana_ai_app/features/canvas/domain/repositories/feature_repository.dart';

final class CanvasSaveRecord {
  const CanvasSaveRecord(this._repository);

  final CanvasFeatureRepository _repository;

  Future<void> call(CanvasRecord record) => _repository.save(record);
}
