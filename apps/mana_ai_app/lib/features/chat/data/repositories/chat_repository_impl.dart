import 'package:mana_ai_app/core/network/request_cancellation.dart';
import 'package:mana_ai_app/core/services/secure_id_generator.dart';
import 'package:mana_ai_app/core/security/input_validator.dart';

import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_conversation_repository.dart';
import '../datasources/chat_local_datasource.dart';
import '../datasources/chat_remote_datasource.dart';

final class ChatConversationRepositoryImpl
    implements ChatConversationRepository {
  static const maximumContextMessages = 100;

  ChatConversationRepositoryImpl({
    required ChatLocalDataSource localDataSource,
    required ChatRemoteDataSource remoteDataSource,
    String conversationId = 'current',
    DateTime Function()? clock,
    SecureIdGenerator? idGenerator,
  })  : _localDataSource = localDataSource,
        _remoteDataSource = remoteDataSource,
        _conversationId = conversationId,
        _clock = clock ?? DateTime.now,
        _idGenerator = idGenerator ?? SecureIdGenerator() {
    if (conversationId.trim().isEmpty || conversationId.length > 128) {
      throw ArgumentError.value(conversationId, 'conversationId');
    }
  }

  final ChatLocalDataSource _localDataSource;
  final ChatRemoteDataSource _remoteDataSource;
  final String _conversationId;
  final DateTime Function() _clock;
  final SecureIdGenerator _idGenerator;
  List<ChatMessage> _messages = [];
  Future<void>? _initialization;
  RequestCancellation? _activeCancellation;
  bool _isGenerating = false;

  @override
  List<ChatMessage> get messages => List.unmodifiable(_messages);

  @override
  bool get isGenerating => _isGenerating;

  @override
  Future<void> initialize() => _initialization ??= _loadMessages();

  Future<void> _loadMessages() async {
    try {
      _messages = List.of(
        await _localDataSource.loadMessages(_conversationId),
      );
    } catch (_) {
      _initialization = null;
      rethrow;
    }
  }

  @override
  Stream<ChatMessage> sendMessage({
    required String content,
    required String model,
  }) async* {
    await initialize();
    if (_isGenerating) {
      throw StateError('A chat response is already being generated.');
    }
    final cancellation = RequestCancellation();
    _activeCancellation = cancellation;
    _isGenerating = true;
    var messagesChanged = false;
    var assistantMessageId = '';
    var assistantContent = '';
    final assistantCreatedAt = _clock().toUtc();

    try {
      final normalizedContent = InputValidator.normalizeChatMessage(content);
      final userMessage = ChatMessage(
        id: _idGenerator.nextUuid(),
        role: ChatMessageRole.user,
        content: normalizedContent,
        createdAt: _clock().toUtc(),
      );
      final nextMessages = [..._messages, userMessage];
      await _localDataSource.saveMessages(_conversationId, nextMessages);
      _messages = nextMessages;
      messagesChanged = true;
      yield userMessage;
      final contextStart =
          _messages.length > maximumContextMessages
              ? _messages.length - maximumContextMessages
              : 0;
      final requestHistory = List<ChatMessage>.unmodifiable(
        _messages.skip(contextStart),
      );
      await for (final chunk in _remoteDataSource.streamCompletion(
        model: model,
        messages: requestHistory,
        cancellation: cancellation,
      )) {
        if (chunk.content.isNotEmpty) {
          if (assistantMessageId.isEmpty) {
            assistantMessageId = _idGenerator.nextUuid();
          }
          assistantContent += chunk.content;
          final assistantMessage = ChatMessage(
            id: assistantMessageId,
            role: ChatMessageRole.assistant,
            content: assistantContent,
            createdAt: assistantCreatedAt,
          );
          _messages = _replaceMessage(_messages, assistantMessage);
          yield assistantMessage;
        }
        if (chunk.isComplete) break;
      }
    } finally {
      try {
        if (messagesChanged) {
          await _localDataSource.saveMessages(_conversationId, _messages);
        }
      } finally {
        _activeCancellation = null;
        _isGenerating = false;
      }
    }
  }

  List<ChatMessage> _replaceMessage(
    List<ChatMessage> messages,
    ChatMessage updated,
  ) {
    final index = messages.indexWhere((message) => message.id == updated.id);
    if (index == -1) return [...messages, updated];
    final result = List<ChatMessage>.of(messages);
    result[index] = updated;
    return result;
  }

  @override
  void stopGeneration() {
    _activeCancellation?.cancel();
  }

  @override
  Future<void> clearMessages() async {
    if (_isGenerating) {
      throw StateError('Stop the active response before clearing the chat.');
    }
    await initialize();
    await _localDataSource.clearMessages(_conversationId);
    _messages = [];
  }
}
