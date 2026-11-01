import 'package:mana_ai_app/features/agents/domain/entities/record.dart';
import 'package:mana_ai_app/features/agents/data/models/record_model.dart';

abstract final class AgentsRecordMapper {
  static AgentsRecord fromModel(
    AgentsRecordModel model,
  ) =>
      AgentsRecord(id: model.id, createdAt: model.createdAt);

  static AgentsRecordModel toModel(
    AgentsRecord record,
  ) =>
      AgentsRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
