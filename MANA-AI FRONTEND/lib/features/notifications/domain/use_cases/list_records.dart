import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';
import 'package:mana_ai_app/features/notifications/domain/repositories/feature_repository.dart';

final class NotificationsListRecords {
  const NotificationsListRecords(this._repository);

  final NotificationsFeatureRepository _repository;

  Future<PaginatedResult<NotificationsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
