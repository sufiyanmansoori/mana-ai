import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';

abstract interface class CanvasRemoteDataSource {
  Future<PaginatedResult<CanvasRecord>> list(
    PageCursor cursor,
  );

  Future<CanvasRecord?> getById(String id);

  Future<void> save(CanvasRecord record);

  Future<void> delete(String id);
}
