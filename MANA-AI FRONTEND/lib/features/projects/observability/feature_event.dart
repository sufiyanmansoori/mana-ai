final class ProjectsFeatureEvent {
  const ProjectsFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
