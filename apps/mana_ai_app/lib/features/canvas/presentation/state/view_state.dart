import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';

enum CanvasViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class CanvasViewState {
  CanvasViewState({
    required this.phase,
    List<CanvasRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final CanvasViewPhase phase;
  final List<CanvasRecord> records;
  final Object? error;
}
