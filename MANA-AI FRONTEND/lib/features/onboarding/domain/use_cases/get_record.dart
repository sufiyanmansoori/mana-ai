import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';
import 'package:mana_ai_app/features/onboarding/domain/repositories/feature_repository.dart';

final class OnboardingGetRecord {
  const OnboardingGetRecord(this._repository);

  final OnboardingFeatureRepository _repository;

  Future<OnboardingRecord?> call(String id) => _repository.getById(id);
}
