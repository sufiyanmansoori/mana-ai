import 'package:mana_ai_app/features/share/domain/entities/record.dart';
import 'package:mana_ai_app/features/share/data/models/record_model.dart';

abstract final class ShareRecordMapper {
  static ShareRecord fromModel(
    ShareRecordModel model,
  ) =>
      ShareRecord(id: model.id, createdAt: model.createdAt);

  static ShareRecordModel toModel(
    ShareRecord record,
  ) =>
      ShareRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
