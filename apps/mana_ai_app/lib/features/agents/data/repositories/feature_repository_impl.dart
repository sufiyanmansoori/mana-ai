import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/agents/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/agents/domain/entities/record.dart';
import 'package:mana_ai_app/features/agents/domain/repositories/feature_repository.dart';

final class AgentsFeatureRepositoryImpl implements AgentsFeatureRepository {
  const AgentsFeatureRepositoryImpl(this._remote);

  final AgentsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<AgentsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<AgentsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(AgentsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
