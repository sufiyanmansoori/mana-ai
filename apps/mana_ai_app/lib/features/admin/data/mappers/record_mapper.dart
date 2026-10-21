import 'package:mana_ai_app/features/admin/domain/entities/record.dart';
import 'package:mana_ai_app/features/admin/data/models/record_model.dart';

abstract final class AdminRecordMapper {
  static AdminRecord fromModel(
    AdminRecordModel model,
  ) =>
      AdminRecord(id: model.id, createdAt: model.createdAt);

  static AdminRecordModel toModel(
    AdminRecord record,
  ) =>
      AdminRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
