import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/admin/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';
import 'package:mana_ai_app/features/admin/domain/repositories/feature_repository.dart';

final class AdminFeatureRepositoryImpl implements AdminFeatureRepository {
  const AdminFeatureRepositoryImpl(this._remote);

  final AdminRemoteDataSource _remote;

  @override
  Future<PaginatedResult<AdminRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<AdminRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(AdminRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
