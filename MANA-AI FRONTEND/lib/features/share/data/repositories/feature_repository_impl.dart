import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/share/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/share/domain/entities/record.dart';
import 'package:mana_ai_app/features/share/domain/repositories/feature_repository.dart';

final class ShareFeatureRepositoryImpl implements ShareFeatureRepository {
  const ShareFeatureRepositoryImpl(this._remote);

  final ShareRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ShareRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ShareRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ShareRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
