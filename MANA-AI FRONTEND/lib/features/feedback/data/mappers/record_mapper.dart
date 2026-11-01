import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';
import 'package:mana_ai_app/features/feedback/data/models/record_model.dart';

abstract final class FeedbackRecordMapper {
  static FeedbackRecord fromModel(
    FeedbackRecordModel model,
  ) =>
      FeedbackRecord(id: model.id, createdAt: model.createdAt);

  static FeedbackRecordModel toModel(
    FeedbackRecord record,
  ) =>
      FeedbackRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
