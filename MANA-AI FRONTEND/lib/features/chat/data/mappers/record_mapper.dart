import 'package:mana_ai_app/features/chat/domain/entities/record.dart';
import 'package:mana_ai_app/features/chat/data/models/record_model.dart';

abstract final class ChatRecordMapper {
  static ChatRecord fromModel(
    ChatRecordModel model,
  ) =>
      ChatRecord(id: model.id, createdAt: model.createdAt);

  static ChatRecordModel toModel(
    ChatRecord record,
  ) =>
      ChatRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
