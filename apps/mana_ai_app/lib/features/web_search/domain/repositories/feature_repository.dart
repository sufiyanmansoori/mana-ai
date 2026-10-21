import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';

abstract interface class WebSearchFeatureRepository {
  Future<PaginatedResult<WebSearchRecord>> list(
    PageCursor cursor,
  );

  Future<WebSearchRecord?> getById(String id);

  Future<void> save(WebSearchRecord record);

  Future<void> delete(String id);
}
