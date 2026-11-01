final class OnboardingFeatureEvent {
  const OnboardingFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
