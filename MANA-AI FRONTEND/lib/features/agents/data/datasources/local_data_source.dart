import 'package:mana_ai_app/features/agents/domain/entities/record.dart';

abstract interface class AgentsLocalDataSource {
  Future<List<AgentsRecord>> readAll();

  Future<AgentsRecord?> getById(String id);

  Future<void> save(AgentsRecord record);

  Future<void> delete(String id);
}
