import '../security/privacy_controller.dart';

abstract interface class AnalyticsSink {
  Future<void> track(String name, Map<String, Object?> properties);
}

abstract interface class AnalyticsService {
  Future<void> track(String name, {Map<String, Object?> properties});
}

final class ConsentAwareAnalyticsService implements AnalyticsService {
  ConsentAwareAnalyticsService({
    required PrivacyController consent,
    required AnalyticsSink sink,
  })  : _consent = consent,
        _sink = sink;

  final PrivacyController _consent;
  final AnalyticsSink _sink;

  @override
  Future<void> track(
    String name, {
    Map<String, Object?> properties = const {},
  }) async {
    if (!_consent.analyticsAllowed) return;
    if (!RegExp(r'^[a-z][a-z0-9_.-]{0,63}$').hasMatch(name)) {
      throw ArgumentError.value(name, 'name');
    }
    if (properties.length > 20 ||
        properties.entries.any(
          (entry) =>
              entry.key.length > 64 ||
              entry.value is String && (entry.value as String).length > 256,
        )) {
      throw ArgumentError('Analytics properties exceed the allowed limits.');
    }
    await _sink.track(name, Map.unmodifiable(properties));
  }
}