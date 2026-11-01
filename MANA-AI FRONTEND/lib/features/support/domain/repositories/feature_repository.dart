import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/support/domain/entities/record.dart';

abstract interface class SupportFeatureRepository {
  Future<PaginatedResult<SupportRecord>> list(
    PageCursor cursor,
  );

  Future<SupportRecord?> getById(String id);

  Future<void> save(SupportRecord record);

  Future<void> delete(String id);
}
