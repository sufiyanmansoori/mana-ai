import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';
import 'package:mana_ai_app/features/authentication/domain/repositories/feature_repository.dart';

final class AuthenticationSaveRecord {
  const AuthenticationSaveRecord(this._repository);

  final AuthenticationFeatureRepository _repository;

  Future<void> call(AuthenticationRecord record) => _repository.save(record);
}
