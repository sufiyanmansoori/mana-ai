import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/features/chat/data/datasources/chat_database.dart';
import 'package:mana_ai_app/features/chat/data/datasources/chat_local_datasource_impl.dart';
import 'package:mana_ai_app/features/chat/domain/entities/chat_message.dart';

void main() {
  late ChatDatabase database;
  late DriftChatLocalDataSource dataSource;

  setUp(() {
    database = ChatDatabase(NativeDatabase.memory());
    dataSource = DriftChatLocalDataSource(database);
  });

  tearDown(() async {
    await database.close();
  });

  test('persists ordered messages and isolates conversations', () async {
    final first = ChatMessage(
      id: 'message-1',
      role: ChatMessageRole.user,
      content: 'Hello',
      createdAt: DateTime.utc(2026, 1, 1),
    );
    final second = ChatMessage(
      id: 'message-2',
      role: ChatMessageRole.assistant,
      content: 'Hi',
      createdAt: DateTime.utc(2026, 1, 1, 0, 0, 1),
    );

    await dataSource.saveMessages('conversation-a', [first, second]);
    await dataSource.saveMessages(
      'conversation-b',
      [
        ChatMessage(
          id: 'message-3',
          role: ChatMessageRole.user,
          content: 'Separate',
          createdAt: DateTime.utc(2026, 1, 1),
        ),
      ],
    );

    expect(
      (await dataSource.loadMessages('conversation-a'))
          .map((message) => message.content),
      ['Hello', 'Hi'],
    );
    expect(
      (await dataSource.loadMessages('conversation-b')).single.id,
      'message-3',
    );
  });

  test('replaces and clears only the selected conversation', () async {
    final original = ChatMessage(
      id: 'message-1',
      role: ChatMessageRole.user,
      content: 'Hello',
      createdAt: DateTime.utc(2026, 1, 1),
    );
    await dataSource.saveMessages('conversation-a', [original]);
    await dataSource.saveMessages('conversation-a', const []);
    await dataSource.saveMessages(
      'conversation-b',
      [
        ChatMessage(
          id: 'message-2',
          role: ChatMessageRole.user,
          content: 'Other chat',
          createdAt: DateTime.utc(2026, 1, 1),
        ),
      ],
    );
    await dataSource.clearMessages('conversation-a');

    expect(await dataSource.loadMessages('conversation-a'), isEmpty);
    expect(await dataSource.loadMessages('conversation-b'), hasLength(1));
  });
}
