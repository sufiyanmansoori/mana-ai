import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';

enum SubscriptionViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class SubscriptionViewState {
  SubscriptionViewState({
    required this.phase,
    List<SubscriptionRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final SubscriptionViewPhase phase;
  final List<SubscriptionRecord> records;
  final Object? error;
}
