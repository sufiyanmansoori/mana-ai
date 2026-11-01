import 'package:mana_ai_app/features/profile/domain/entities/record.dart';
import 'package:mana_ai_app/features/profile/data/models/record_model.dart';

abstract final class ProfileRecordMapper {
  static ProfileRecord fromModel(
    ProfileRecordModel model,
  ) =>
      ProfileRecord(id: model.id, createdAt: model.createdAt);

  static ProfileRecordModel toModel(
    ProfileRecord record,
  ) =>
      ProfileRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
