import 'package:mana_ai_app/features/explore/domain/entities/record.dart';
import 'package:mana_ai_app/features/explore/data/models/record_model.dart';

abstract final class ExploreRecordMapper {
  static ExploreRecord fromModel(
    ExploreRecordModel model,
  ) =>
      ExploreRecord(id: model.id, createdAt: model.createdAt);

  static ExploreRecordModel toModel(
    ExploreRecord record,
  ) =>
      ExploreRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
