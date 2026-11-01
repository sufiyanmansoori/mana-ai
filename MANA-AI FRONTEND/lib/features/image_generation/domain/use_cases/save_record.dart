import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';
import 'package:mana_ai_app/features/image_generation/domain/repositories/feature_repository.dart';

final class ImageGenerationSaveRecord {
  const ImageGenerationSaveRecord(this._repository);

  final ImageGenerationFeatureRepository _repository;

  Future<void> call(ImageGenerationRecord record) => _repository.save(record);
}
