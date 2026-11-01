final class ConversationsFeatureEvent {
  const ConversationsFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
