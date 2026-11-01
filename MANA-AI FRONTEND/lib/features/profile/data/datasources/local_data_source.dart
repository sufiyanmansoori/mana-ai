import 'package:mana_ai_app/features/profile/domain/entities/record.dart';

abstract interface class ProfileLocalDataSource {
  Future<List<ProfileRecord>> readAll();

  Future<ProfileRecord?> getById(String id);

  Future<void> save(ProfileRecord record);

  Future<void> delete(String id);
}
