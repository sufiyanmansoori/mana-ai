import 'package:mana_ai_app/features/agents/domain/entities/record.dart';
import 'package:mana_ai_app/features/agents/domain/repositories/feature_repository.dart';

final class AgentsGetRecord {
  const AgentsGetRecord(this._repository);

  final AgentsFeatureRepository _repository;

  Future<AgentsRecord?> call(String id) => _repository.getById(id);
}
