import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'chat_database.g.dart';

@DataClassName('ChatMessageRow')
class ChatMessages extends Table {
  TextColumn get id => text()();

  TextColumn get conversationId => text()();

  TextColumn get role => text()();

  TextColumn get content => text()();

  DateTimeColumn get createdAt => dateTime()();

  @override
  Set<Column<Object>> get primaryKey => {id};
}

@DriftDatabase(tables: [ChatMessages])
class ChatDatabase extends _$ChatDatabase {
  ChatDatabase([QueryExecutor? executor])
      : super(executor ?? driftDatabase(name: 'mana_ai_chat'));

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration => MigrationStrategy(
        beforeOpen: (details) async {
          await customStatement('PRAGMA foreign_keys = ON');
        },
      );
}
