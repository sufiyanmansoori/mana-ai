import 'package:mana_ai_app/features/models/domain/entities/record.dart';
import 'package:mana_ai_app/features/models/data/models/record_model.dart';

abstract final class ModelsRecordMapper {
  static ModelsRecord fromModel(
    ModelsRecordModel model,
  ) =>
      ModelsRecord(id: model.id, createdAt: model.createdAt);

  static ModelsRecordModel toModel(
    ModelsRecord record,
  ) =>
      ModelsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
