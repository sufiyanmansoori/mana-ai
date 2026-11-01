import 'package:mana_ai_app/features/profile/domain/entities/record.dart';
import 'package:mana_ai_app/features/profile/domain/repositories/feature_repository.dart';

final class ProfileGetRecord {
  const ProfileGetRecord(this._repository);

  final ProfileFeatureRepository _repository;

  Future<ProfileRecord?> call(String id) => _repository.getById(id);
}
