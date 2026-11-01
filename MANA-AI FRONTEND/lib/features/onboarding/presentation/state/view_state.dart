import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';

enum OnboardingViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class OnboardingViewState {
  OnboardingViewState({
    required this.phase,
    List<OnboardingRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final OnboardingViewPhase phase;
  final List<OnboardingRecord> records;
  final Object? error;
}
