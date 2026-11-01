import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';

abstract interface class NotificationsFeatureRepository {
  Future<PaginatedResult<NotificationsRecord>> list(
    PageCursor cursor,
  );

  Future<NotificationsRecord?> getById(String id);

  Future<void> save(NotificationsRecord record);

  Future<void> delete(String id);
}
