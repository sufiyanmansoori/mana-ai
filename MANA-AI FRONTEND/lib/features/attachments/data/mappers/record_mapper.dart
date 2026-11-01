import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';
import 'package:mana_ai_app/features/attachments/data/models/record_model.dart';

abstract final class AttachmentsRecordMapper {
  static AttachmentsRecord fromModel(
    AttachmentsRecordModel model,
  ) =>
      AttachmentsRecord(id: model.id, createdAt: model.createdAt);

  static AttachmentsRecordModel toModel(
    AttachmentsRecord record,
  ) =>
      AttachmentsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
