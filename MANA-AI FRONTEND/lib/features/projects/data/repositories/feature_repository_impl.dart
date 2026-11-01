import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/projects/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/projects/domain/entities/record.dart';
import 'package:mana_ai_app/features/projects/domain/repositories/feature_repository.dart';

final class ProjectsFeatureRepositoryImpl implements ProjectsFeatureRepository {
  const ProjectsFeatureRepositoryImpl(this._remote);

  final ProjectsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ProjectsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ProjectsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ProjectsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
