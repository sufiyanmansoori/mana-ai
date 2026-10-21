import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/projects/domain/entities/record.dart';
import 'package:mana_ai_app/features/projects/domain/repositories/feature_repository.dart';

final class ProjectsListRecords {
  const ProjectsListRecords(this._repository);

  final ProjectsFeatureRepository _repository;

  Future<PaginatedResult<ProjectsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
