import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';
import 'package:mana_ai_app/features/subscription/data/models/record_model.dart';

abstract final class SubscriptionRecordMapper {
  static SubscriptionRecord fromModel(
    SubscriptionRecordModel model,
  ) =>
      SubscriptionRecord(id: model.id, createdAt: model.createdAt);

  static SubscriptionRecordModel toModel(
    SubscriptionRecord record,
  ) =>
      SubscriptionRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
