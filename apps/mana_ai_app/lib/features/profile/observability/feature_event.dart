final class ProfileFeatureEvent {
  const ProfileFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
