import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';

abstract interface class AuthenticationLocalDataSource {
  Future<List<AuthenticationRecord>> readAll();

  Future<AuthenticationRecord?> getById(String id);

  Future<void> save(AuthenticationRecord record);

  Future<void> delete(String id);
}
