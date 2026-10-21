import '../entities/chat_message.dart';

abstract interface class ChatConversationRepository {
  List<ChatMessage> get messages;

  bool get isGenerating;

  Future<void> initialize();

  Stream<ChatMessage> sendMessage({
    required String content,
    required String model,
  });

  void stopGeneration();

  Future<void> clearMessages();
}
