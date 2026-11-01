import 'package:mana_ai_app/features/models/domain/entities/record.dart';

enum ModelsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ModelsViewState {
  ModelsViewState({
    required this.phase,
    List<ModelsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ModelsViewPhase phase;
  final List<ModelsRecord> records;
  final Object? error;
}
