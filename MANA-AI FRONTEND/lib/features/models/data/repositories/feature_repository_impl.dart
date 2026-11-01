import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/models/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/models/domain/entities/record.dart';
import 'package:mana_ai_app/features/models/domain/repositories/feature_repository.dart';

final class ModelsFeatureRepositoryImpl implements ModelsFeatureRepository {
  const ModelsFeatureRepositoryImpl(this._remote);

  final ModelsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ModelsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ModelsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ModelsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
