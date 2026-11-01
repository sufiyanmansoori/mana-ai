import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/share/domain/entities/record.dart';

abstract interface class ShareRemoteDataSource {
  Future<PaginatedResult<ShareRecord>> list(
    PageCursor cursor,
  );

  Future<ShareRecord?> getById(String id);

  Future<void> save(ShareRecord record);

  Future<void> delete(String id);
}
