import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/subscription/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';
import 'package:mana_ai_app/features/subscription/domain/repositories/feature_repository.dart';

final class SubscriptionFeatureRepositoryImpl
    implements SubscriptionFeatureRepository {
  const SubscriptionFeatureRepositoryImpl(this._remote);

  final SubscriptionRemoteDataSource _remote;

  @override
  Future<PaginatedResult<SubscriptionRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<SubscriptionRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(SubscriptionRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
