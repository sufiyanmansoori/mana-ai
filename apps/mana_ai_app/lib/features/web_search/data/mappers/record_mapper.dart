import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';
import 'package:mana_ai_app/features/web_search/data/models/record_model.dart';

abstract final class WebSearchRecordMapper {
  static WebSearchRecord fromModel(
    WebSearchRecordModel model,
  ) =>
      WebSearchRecord(id: model.id, createdAt: model.createdAt);

  static WebSearchRecordModel toModel(
    WebSearchRecord record,
  ) =>
      WebSearchRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
