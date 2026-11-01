import 'package:mana_ai_app/features/projects/domain/entities/record.dart';

enum ProjectsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ProjectsViewState {
  ProjectsViewState({
    required this.phase,
    List<ProjectsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ProjectsViewPhase phase;
  final List<ProjectsRecord> records;
  final Object? error;
}
