import 'package:mana_ai_app/features/agents/domain/entities/record.dart';

enum AgentsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class AgentsViewState {
  AgentsViewState({
    required this.phase,
    List<AgentsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final AgentsViewPhase phase;
  final List<AgentsRecord> records;
  final Object? error;
}
