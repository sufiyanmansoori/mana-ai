import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/projects/domain/entities/record.dart';

abstract interface class ProjectsFeatureRepository {
  Future<PaginatedResult<ProjectsRecord>> list(
    PageCursor cursor,
  );

  Future<ProjectsRecord?> getById(String id);

  Future<void> save(ProjectsRecord record);

  Future<void> delete(String id);
}
