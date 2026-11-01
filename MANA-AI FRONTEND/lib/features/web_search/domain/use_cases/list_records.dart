import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';
import 'package:mana_ai_app/features/web_search/domain/repositories/feature_repository.dart';

final class WebSearchListRecords {
  const WebSearchListRecords(this._repository);

  final WebSearchFeatureRepository _repository;

  Future<PaginatedResult<WebSearchRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
