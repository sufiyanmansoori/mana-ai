import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';

abstract interface class ConversationsLocalDataSource {
  Future<List<ConversationsRecord>> readAll();

  Future<ConversationsRecord?> getById(String id);

  Future<void> save(ConversationsRecord record);

  Future<void> delete(String id);
}
