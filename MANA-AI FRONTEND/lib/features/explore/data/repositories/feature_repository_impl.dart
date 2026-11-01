import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/explore/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/explore/domain/entities/record.dart';
import 'package:mana_ai_app/features/explore/domain/repositories/feature_repository.dart';

final class ExploreFeatureRepositoryImpl implements ExploreFeatureRepository {
  const ExploreFeatureRepositoryImpl(this._remote);

  final ExploreRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ExploreRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ExploreRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ExploreRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
