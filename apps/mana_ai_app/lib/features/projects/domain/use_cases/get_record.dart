import 'package:mana_ai_app/features/projects/domain/entities/record.dart';
import 'package:mana_ai_app/features/projects/domain/repositories/feature_repository.dart';

final class ProjectsGetRecord {
  const ProjectsGetRecord(this._repository);

  final ProjectsFeatureRepository _repository;

  Future<ProjectsRecord?> call(String id) => _repository.getById(id);
}
