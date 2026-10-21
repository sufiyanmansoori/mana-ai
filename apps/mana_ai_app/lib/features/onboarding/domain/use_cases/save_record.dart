import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';
import 'package:mana_ai_app/features/onboarding/domain/repositories/feature_repository.dart';

final class OnboardingSaveRecord {
  const OnboardingSaveRecord(this._repository);

  final OnboardingFeatureRepository _repository;

  Future<void> call(OnboardingRecord record) => _repository.save(record);
}
