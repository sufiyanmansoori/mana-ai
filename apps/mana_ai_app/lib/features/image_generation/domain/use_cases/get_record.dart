import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';
import 'package:mana_ai_app/features/image_generation/domain/repositories/feature_repository.dart';

final class ImageGenerationGetRecord {
  const ImageGenerationGetRecord(this._repository);

  final ImageGenerationFeatureRepository _repository;

  Future<ImageGenerationRecord?> call(String id) => _repository.getById(id);
}
