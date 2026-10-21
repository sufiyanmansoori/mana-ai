import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';
import 'package:mana_ai_app/features/onboarding/data/models/record_model.dart';

abstract final class OnboardingRecordMapper {
  static OnboardingRecord fromModel(
    OnboardingRecordModel model,
  ) =>
      OnboardingRecord(id: model.id, createdAt: model.createdAt);

  static OnboardingRecordModel toModel(
    OnboardingRecord record,
  ) =>
      OnboardingRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
