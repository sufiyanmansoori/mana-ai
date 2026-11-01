import 'package:mana_ai_app/features/agents/domain/entities/record.dart';
import 'package:mana_ai_app/features/agents/domain/repositories/feature_repository.dart';

final class AgentsSaveRecord {
  const AgentsSaveRecord(this._repository);

  final AgentsFeatureRepository _repository;

  Future<void> call(AgentsRecord record) => _repository.save(record);
}
