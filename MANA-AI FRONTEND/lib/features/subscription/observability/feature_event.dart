final class SubscriptionFeatureEvent {
  const SubscriptionFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
