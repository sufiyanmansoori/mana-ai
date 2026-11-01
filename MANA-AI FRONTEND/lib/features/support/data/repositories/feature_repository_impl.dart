import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/support/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/support/domain/entities/record.dart';
import 'package:mana_ai_app/features/support/domain/repositories/feature_repository.dart';

final class SupportFeatureRepositoryImpl implements SupportFeatureRepository {
  const SupportFeatureRepositoryImpl(this._remote);

  final SupportRemoteDataSource _remote;

  @override
  Future<PaginatedResult<SupportRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<SupportRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(SupportRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
