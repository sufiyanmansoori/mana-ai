import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';

enum ConversationsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ConversationsViewState {
  ConversationsViewState({
    required this.phase,
    List<ConversationsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ConversationsViewPhase phase;
  final List<ConversationsRecord> records;
  final Object? error;
}
