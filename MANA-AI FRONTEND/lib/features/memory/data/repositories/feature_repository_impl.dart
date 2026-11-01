import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/memory/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/memory/domain/entities/record.dart';
import 'package:mana_ai_app/features/memory/domain/repositories/feature_repository.dart';

final class MemoryFeatureRepositoryImpl implements MemoryFeatureRepository {
  const MemoryFeatureRepositoryImpl(this._remote);

  final MemoryRemoteDataSource _remote;

  @override
  Future<PaginatedResult<MemoryRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<MemoryRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(MemoryRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
