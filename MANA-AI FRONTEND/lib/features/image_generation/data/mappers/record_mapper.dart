import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';
import 'package:mana_ai_app/features/image_generation/data/models/record_model.dart';

abstract final class ImageGenerationRecordMapper {
  static ImageGenerationRecord fromModel(
    ImageGenerationRecordModel model,
  ) =>
      ImageGenerationRecord(id: model.id, createdAt: model.createdAt);

  static ImageGenerationRecordModel toModel(
    ImageGenerationRecord record,
  ) =>
      ImageGenerationRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
