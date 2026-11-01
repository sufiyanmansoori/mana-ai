import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';

abstract interface class ImageGenerationLocalDataSource {
  Future<List<ImageGenerationRecord>> readAll();

  Future<ImageGenerationRecord?> getById(String id);

  Future<void> save(ImageGenerationRecord record);

  Future<void> delete(String id);
}
