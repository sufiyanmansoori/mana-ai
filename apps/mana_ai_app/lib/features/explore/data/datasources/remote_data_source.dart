import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/explore/domain/entities/record.dart';

abstract interface class ExploreRemoteDataSource {
  Future<PaginatedResult<ExploreRecord>> list(
    PageCursor cursor,
  );

  Future<ExploreRecord?> getById(String id);

  Future<void> save(ExploreRecord record);

  Future<void> delete(String id);
}
