final class NotificationsFeatureEvent {
  const NotificationsFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
