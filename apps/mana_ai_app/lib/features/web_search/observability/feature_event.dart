final class WebSearchFeatureEvent {
  const WebSearchFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
