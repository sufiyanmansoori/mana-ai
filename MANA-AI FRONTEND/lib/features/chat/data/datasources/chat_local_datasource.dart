import '../../domain/entities/chat_message.dart';

abstract interface class ChatLocalDataSource {
  Future<List<ChatMessage>> loadMessages(String conversationId);

  Future<void> saveMessages(
    String conversationId,
    List<ChatMessage> messages,
  );

  Future<void> clearMessages(String conversationId);
}
