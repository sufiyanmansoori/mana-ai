import 'package:mana_ai_app/features/memory/domain/entities/record.dart';

enum MemoryViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class MemoryViewState {
  MemoryViewState({
    required this.phase,
    List<MemoryRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final MemoryViewPhase phase;
  final List<MemoryRecord> records;
  final Object? error;
}
