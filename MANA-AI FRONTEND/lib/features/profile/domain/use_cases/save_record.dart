import 'package:mana_ai_app/features/profile/domain/entities/record.dart';
import 'package:mana_ai_app/features/profile/domain/repositories/feature_repository.dart';

final class ProfileSaveRecord {
  const ProfileSaveRecord(this._repository);

  final ProfileFeatureRepository _repository;

  Future<void> call(ProfileRecord record) => _repository.save(record);
}
