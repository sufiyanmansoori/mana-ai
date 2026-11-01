import 'package:mana_ai_app/features/projects/domain/entities/record.dart';
import 'package:mana_ai_app/features/projects/data/models/record_model.dart';

abstract final class ProjectsRecordMapper {
  static ProjectsRecord fromModel(
    ProjectsRecordModel model,
  ) =>
      ProjectsRecord(id: model.id, createdAt: model.createdAt);

  static ProjectsRecordModel toModel(
    ProjectsRecord record,
  ) =>
      ProjectsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
