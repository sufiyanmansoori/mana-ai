import 'package:mana_ai_app/features/projects/domain/entities/record.dart';
import 'package:mana_ai_app/features/projects/domain/repositories/feature_repository.dart';

final class ProjectsSaveRecord {
  const ProjectsSaveRecord(this._repository);

  final ProjectsFeatureRepository _repository;

  Future<void> call(ProjectsRecord record) => _repository.save(record);
}
