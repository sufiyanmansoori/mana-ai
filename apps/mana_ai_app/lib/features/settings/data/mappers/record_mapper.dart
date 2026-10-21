import 'package:mana_ai_app/features/settings/domain/entities/record.dart';
import 'package:mana_ai_app/features/settings/data/models/record_model.dart';

abstract final class SettingsRecordMapper {
  static SettingsRecord fromModel(
    SettingsRecordModel model,
  ) =>
      SettingsRecord(id: model.id, createdAt: model.createdAt);

  static SettingsRecordModel toModel(
    SettingsRecord record,
  ) =>
      SettingsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
