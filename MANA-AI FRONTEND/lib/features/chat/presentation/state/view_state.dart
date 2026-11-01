import 'package:mana_ai_app/features/chat/domain/entities/record.dart';

enum ChatViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ChatViewState {
  ChatViewState({
    required this.phase,
    List<ChatRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ChatViewPhase phase;
  final List<ChatRecord> records;
  final Object? error;
}
