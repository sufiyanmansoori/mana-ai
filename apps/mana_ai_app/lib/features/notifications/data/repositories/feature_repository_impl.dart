import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/notifications/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';
import 'package:mana_ai_app/features/notifications/domain/repositories/feature_repository.dart';

final class NotificationsFeatureRepositoryImpl
    implements NotificationsFeatureRepository {
  const NotificationsFeatureRepositoryImpl(this._remote);

  final NotificationsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<NotificationsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<NotificationsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(NotificationsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
