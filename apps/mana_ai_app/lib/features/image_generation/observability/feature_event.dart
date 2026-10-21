final class ImageGenerationFeatureEvent {
  const ImageGenerationFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
