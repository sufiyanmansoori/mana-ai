final class AuthenticationFeatureEvent {
  const AuthenticationFeatureEvent({
    required this.name,
    required this.occurredAt,
  });

  final String name;
  final DateTime occurredAt;
}
