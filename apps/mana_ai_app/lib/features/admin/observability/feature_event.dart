final class AdminFeatureEvent {
  const AdminFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
