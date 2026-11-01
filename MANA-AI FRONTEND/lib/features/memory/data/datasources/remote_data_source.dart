import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/memory/domain/entities/record.dart';

abstract interface class MemoryRemoteDataSource {
  Future<PaginatedResult<MemoryRecord>> list(
    PageCursor cursor,
  );

  Future<MemoryRecord?> getById(String id);

  Future<void> save(MemoryRecord record);

  Future<void> delete(String id);
}
