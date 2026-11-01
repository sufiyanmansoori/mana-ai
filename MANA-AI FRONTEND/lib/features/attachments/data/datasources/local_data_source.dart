import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';

abstract interface class AttachmentsLocalDataSource {
  Future<List<AttachmentsRecord>> readAll();

  Future<AttachmentsRecord?> getById(String id);

  Future<void> save(AttachmentsRecord record);

  Future<void> delete(String id);
}
