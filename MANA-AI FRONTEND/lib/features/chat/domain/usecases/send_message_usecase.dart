import '../../../../core/security/input_validator.dart';
import '../entities/chat_message.dart';
import '../repositories/chat_conversation_repository.dart';

final class SendMessageUseCase {
  const SendMessageUseCase(this._repository);

  final ChatConversationRepository _repository;

  Stream<ChatMessage> call({
    required String content,
    required String model,
  }) {
    final normalizedContent = InputValidator.normalizeChatMessage(content);
    final normalizedModel = model.trim();
    if (normalizedModel.isEmpty || normalizedModel.length > 128) {
      throw ArgumentError.value(model, 'model');
    }
    return _repository.sendMessage(
      content: normalizedContent,
      model: normalizedModel,
    );
  }
}
