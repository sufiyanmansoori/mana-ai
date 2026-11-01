import 'package:drift/drift.dart';

import '../../domain/entities/chat_message.dart';
import '../models/message_model.dart';
import 'chat_database.dart';
import 'chat_local_datasource.dart';

final class DriftChatLocalDataSource implements ChatLocalDataSource {
  const DriftChatLocalDataSource(this._database);

  final ChatDatabase _database;

  @override
  Future<List<ChatMessage>> loadMessages(String conversationId) async {
    _validateConversationId(conversationId);
    final query = _database.select(_database.chatMessages)
      ..where((row) => row.conversationId.equals(conversationId))
      ..orderBy([
        (row) => OrderingTerm.asc(row.createdAt),
        (row) => OrderingTerm.asc(row.id),
      ]);
    final rows = await query.get();
    return List.unmodifiable(
      rows.map(
        (row) => MessageModel.fromJson({
          'id': row.id,
          'role': row.role,
          'content': row.content,
          'createdAt': row.createdAt.millisecondsSinceEpoch,
        }).toEntity(),
      ),
    );
  }

  @override
  Future<void> saveMessages(
    String conversationId,
    List<ChatMessage> messages,
  ) async {
    _validateConversationId(conversationId);
    if (messages.map((message) => message.id).toSet().length !=
        messages.length) {
      throw ArgumentError('Chat message IDs must be unique.');
    }

    await _database.transaction(() async {
      await (_database.delete(_database.chatMessages)
            ..where((row) => row.conversationId.equals(conversationId)))
          .go();
      if (messages.isNotEmpty) {
        await _database.batch((batch) {
          batch.insertAll(
            _database.chatMessages,
            messages.map(
              (message) => ChatMessagesCompanion.insert(
                id: message.id,
                conversationId: conversationId,
                role: message.role.name,
                content: message.content,
                createdAt: message.createdAt.toUtc(),
              ),
            ),
          );
        });
      }
    });
  }

  @override
  Future<void> clearMessages(String conversationId) async {
    _validateConversationId(conversationId);
    await (_database.delete(_database.chatMessages)
          ..where((row) => row.conversationId.equals(conversationId)))
        .go();
  }

  void _validateConversationId(String value) {
    if (value.trim().isEmpty || value.length > 128) {
      throw ArgumentError.value(value, 'conversationId');
    }
  }
}
