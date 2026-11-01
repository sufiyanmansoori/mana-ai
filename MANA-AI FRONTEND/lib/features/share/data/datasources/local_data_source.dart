import 'package:mana_ai_app/features/share/domain/entities/record.dart';

abstract interface class ShareLocalDataSource {
  Future<List<ShareRecord>> readAll();

  Future<ShareRecord?> getById(String id);

  Future<void> save(ShareRecord record);

  Future<void> delete(String id);
}
