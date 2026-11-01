import 'package:mana_ai_app/features/chat/domain/entities/record.dart';

abstract interface class ChatLocalDataSource {
  Future<List<ChatRecord>> readAll();

  Future<ChatRecord?> getById(String id);

  Future<void> save(ChatRecord record);

  Future<void> delete(String id);
}
