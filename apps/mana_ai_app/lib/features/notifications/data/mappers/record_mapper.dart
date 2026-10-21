import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';
import 'package:mana_ai_app/features/notifications/data/models/record_model.dart';

abstract final class NotificationsRecordMapper {
  static NotificationsRecord fromModel(
    NotificationsRecordModel model,
  ) =>
      NotificationsRecord(id: model.id, createdAt: model.createdAt);

  static NotificationsRecordModel toModel(
    NotificationsRecord record,
  ) =>
      NotificationsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
