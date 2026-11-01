import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';
import 'package:mana_ai_app/features/authentication/domain/repositories/feature_repository.dart';

final class AuthenticationGetRecord {
  const AuthenticationGetRecord(this._repository);

  final AuthenticationFeatureRepository _repository;

  Future<AuthenticationRecord?> call(String id) => _repository.getById(id);
}
