import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/settings/domain/entities/record.dart';

abstract interface class SettingsFeatureRepository {
  Future<PaginatedResult<SettingsRecord>> list(
    PageCursor cursor,
  );

  Future<SettingsRecord?> getById(String id);

  Future<void> save(SettingsRecord record);

  Future<void> delete(String id);
}
