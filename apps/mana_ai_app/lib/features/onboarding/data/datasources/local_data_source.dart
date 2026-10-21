import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';

abstract interface class OnboardingLocalDataSource {
  Future<List<OnboardingRecord>> readAll();

  Future<OnboardingRecord?> getById(String id);

  Future<void> save(OnboardingRecord record);

  Future<void> delete(String id);
}
