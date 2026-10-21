import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';
import 'package:mana_ai_app/features/canvas/data/models/record_model.dart';

abstract final class CanvasRecordMapper {
  static CanvasRecord fromModel(
    CanvasRecordModel model,
  ) =>
      CanvasRecord(id: model.id, createdAt: model.createdAt);

  static CanvasRecordModel toModel(
    CanvasRecord record,
  ) =>
      CanvasRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
