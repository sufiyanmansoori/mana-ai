import 'package:mana_ai_app/features/explore/domain/entities/record.dart';

enum ExploreViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ExploreViewState {
  ExploreViewState({
    required this.phase,
    List<ExploreRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ExploreViewPhase phase;
  final List<ExploreRecord> records;
  final Object? error;
}
