final class ExploreFeatureEvent {
  const ExploreFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
