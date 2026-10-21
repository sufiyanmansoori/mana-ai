import 'package:flutter/foundation.dart';
import 'package:mana_ai_app/core/error/error_mapper.dart';
import 'package:mana_ai_app/core/foundation/app_failure.dart';

import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_conversation_repository.dart';
import '../../domain/usecases/send_message_usecase.dart';

final class ChatSessionController extends ChangeNotifier {
  ChatSessionController({
    required ChatConversationRepository repository,
    required SendMessageUseCase sendMessage,
  })  : _repository = repository,
        _sendMessage = sendMessage;

  final ChatConversationRepository _repository;
  final SendMessageUseCase _sendMessage;
  AppFailure? _failure;
  bool _isLoading = false;
  bool _stopRequested = false;
  bool _disposed = false;
  Future<void>? _initialization;

  List<ChatMessage> get messages => _repository.messages;

  AppFailure? get failure => _failure;

  bool get isLoading => _isLoading;

  bool get isGenerating => _repository.isGenerating;

  Future<void> initialize() {
    _ensureAlive();
    return _initialization ??= _load();
  }

  Future<void> _load() async {
    _isLoading = true;
    _notifyListeners();
    try {
      await _repository.initialize();
      _failure = null;
    } catch (error) {
      _initialization = null;
      _failure = ErrorMapper.from(error);
    } finally {
      _isLoading = false;
      _notifyListeners();
    }
  }

  Future<bool> sendMessage({
    required String content,
    required String model,
  }) async {
    _ensureAlive();
    _failure = null;
    _notifyListeners();
    try {
      await for (final _ in _sendMessage(content: content, model: model)) {
        _notifyListeners();
      }
      _notifyListeners();
      return true;
    } catch (error) {
      if (_stopRequested) {
        _failure = null;
        _notifyListeners();
        return false;
      }
      _failure = ErrorMapper.from(error);
      _notifyListeners();
      return false;
    } finally {
      _stopRequested = false;
    }
  }

  void stopGeneration() {
    if (!_repository.isGenerating) return;
    _stopRequested = true;
    _repository.stopGeneration();
  }

  Future<void> clearMessages() async {
    _ensureAlive();
    try {
      await _repository.clearMessages();
      _failure = null;
    } catch (error) {
      _failure = ErrorMapper.from(error);
      rethrow;
    } finally {
      _notifyListeners();
    }
  }

  void clearFailure() {
    if (_failure == null) return;
    _failure = null;
    _notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _repository.stopGeneration();
    super.dispose();
  }

  void _notifyListeners() {
    if (!_disposed) notifyListeners();
  }

  void _ensureAlive() {
    if (_disposed) throw StateError('ChatSessionController is disposed.');
  }
}
