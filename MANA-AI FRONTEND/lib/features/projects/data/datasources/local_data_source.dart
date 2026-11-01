import 'package:mana_ai_app/features/projects/domain/entities/record.dart';

abstract interface class ProjectsLocalDataSource {
  Future<List<ProjectsRecord>> readAll();

  Future<ProjectsRecord?> getById(String id);

  Future<void> save(ProjectsRecord record);

  Future<void> delete(String id);
}
