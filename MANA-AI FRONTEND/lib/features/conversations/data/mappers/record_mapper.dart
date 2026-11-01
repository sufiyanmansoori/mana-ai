import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';
import 'package:mana_ai_app/features/conversations/data/models/record_model.dart';

abstract final class ConversationsRecordMapper {
  static ConversationsRecord fromModel(
    ConversationsRecordModel model,
  ) =>
      ConversationsRecord(id: model.id, createdAt: model.createdAt);

  static ConversationsRecordModel toModel(
    ConversationsRecord record,
  ) =>
      ConversationsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
