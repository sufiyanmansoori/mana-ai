import 'package:mana_ai_app/features/memory/domain/entities/record.dart';
import 'package:mana_ai_app/features/memory/data/models/record_model.dart';

abstract final class MemoryRecordMapper {
  static MemoryRecord fromModel(
    MemoryRecordModel model,
  ) =>
      MemoryRecord(id: model.id, createdAt: model.createdAt);

  static MemoryRecordModel toModel(
    MemoryRecord record,
  ) =>
      MemoryRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
