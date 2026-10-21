import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/models/domain/entities/record.dart';

abstract interface class ModelsFeatureRepository {
  Future<PaginatedResult<ModelsRecord>> list(
    PageCursor cursor,
  );

  Future<ModelsRecord?> getById(String id);

  Future<void> save(ModelsRecord record);

  Future<void> delete(String id);
}
