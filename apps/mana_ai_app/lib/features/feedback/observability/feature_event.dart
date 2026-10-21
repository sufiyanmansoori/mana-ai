final class FeedbackFeatureEvent {
  const FeedbackFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
