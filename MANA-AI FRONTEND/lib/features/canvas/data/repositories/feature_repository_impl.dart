import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/canvas/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';
import 'package:mana_ai_app/features/canvas/domain/repositories/feature_repository.dart';

final class CanvasFeatureRepositoryImpl implements CanvasFeatureRepository {
  const CanvasFeatureRepositoryImpl(this._remote);

  final CanvasRemoteDataSource _remote;

  @override
  Future<PaginatedResult<CanvasRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<CanvasRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(CanvasRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
