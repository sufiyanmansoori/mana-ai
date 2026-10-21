import '../../../../core/security/input_validator.dart';
import '../../../../core/services/secure_id_generator.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_repository.dart';

class LocalChatRepository implements ChatRepository {
  LocalChatRepository({
    DateTime Function()? clock,
    SecureIdGenerator? idGenerator,
  })  : _clock = clock ?? DateTime.now,
        _idGenerator = idGenerator ?? SecureIdGenerator();

  final DateTime Function() _clock;
  final SecureIdGenerator _idGenerator;
  final List<ChatMessage> _messages = [];

  @override
  List<ChatMessage> get messages => List.unmodifiable(_messages);

  @override
  void addUserMessage(String content) {
    final normalizedContent = InputValidator.normalizeChatMessage(content);
    _messages.add(
      ChatMessage(
        id: _idGenerator.nextUuid(),
        role: ChatMessageRole.user,
        content: normalizedContent,
        createdAt: _clock(),
      ),
    );
  }
}
