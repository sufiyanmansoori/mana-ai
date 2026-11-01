import 'package:mana_ai_app/features/support/domain/entities/record.dart';
import 'package:mana_ai_app/features/support/data/models/record_model.dart';

abstract final class SupportRecordMapper {
  static SupportRecord fromModel(
    SupportRecordModel model,
  ) =>
      SupportRecord(id: model.id, createdAt: model.createdAt);

  static SupportRecordModel toModel(
    SupportRecord record,
  ) =>
      SupportRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
