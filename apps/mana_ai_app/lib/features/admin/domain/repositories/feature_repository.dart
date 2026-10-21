import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

abstract interface class AdminFeatureRepository {
  Future<PaginatedResult<AdminRecord>> list(
    PageCursor cursor,
  );

  Future<AdminRecord?> getById(String id);

  Future<void> save(AdminRecord record);

  Future<void> delete(String id);
}
