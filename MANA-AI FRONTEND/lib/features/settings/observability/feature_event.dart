final class SettingsFeatureEvent {
  const SettingsFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
