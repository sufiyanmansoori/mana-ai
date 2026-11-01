import 'package:flutter/foundation.dart';

import '../../../core/error/error_mapper.dart';
import '../../../core/foundation/app_failure.dart';
import '../domain/entities/chat_message.dart';
import '../domain/repositories/chat_repository.dart';

class ChatController extends ChangeNotifier {
  ChatController(this._repository);

  final ChatRepository _repository;
  AppFailure? _failure;

  List<ChatMessage> get messages => _repository.messages;

  AppFailure? get failure => _failure;

  bool sendMessage(String content) {
    try {
      _repository.addUserMessage(content);
      _failure = null;
      notifyListeners();
      return true;
    } on FormatException catch (error) {
      _failure = ErrorMapper.from(error);
      notifyListeners();
      return false;
    }
  }

  void clearFailure() {
    if (_failure == null) return;
    _failure = null;
    notifyListeners();
  }
}
