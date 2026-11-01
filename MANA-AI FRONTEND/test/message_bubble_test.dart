import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:mana_ai_app/features/chat/domain/entities/chat_message.dart';
import 'package:mana_ai_app/features/chat/presentation/widgets/message_bubble.dart';

void main() {
  testWidgets('renders assistant Markdown and offers response copy',
      (tester) async {
    final clipboardCalls = <MethodCall>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (call) async {
        clipboardCalls.add(call);
        return null;
      },
    );
    addTearDown(
      () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        null,
      ),
    );
    final message = ChatMessage(
      id: 'assistant-1',
      role: ChatMessageRole.assistant,
      content: 'A **formatted** answer.\n\n```dart\nprint("hello");\n```',
      createdAt: DateTime.utc(2026, 1, 1),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageBubble(message: message),
        ),
      ),
    );

    expect(find.byType(MarkdownBody), findsOneWidget);
    final renderedMarkdown = tester
        .widgetList<SelectableText>(
          find.descendant(
            of: find.byType(MarkdownBody),
            matching: find.byType(SelectableText),
          ),
        )
        .map((text) => text.textSpan!.toPlainText())
        .join('\n');
    expect(renderedMarkdown, contains('formatted'));
    expect(renderedMarkdown, contains('print("hello");'));
    expect(find.byTooltip('Copy response'), findsOneWidget);
    expect(tester.takeException(), isNull);

    await tester.tap(find.byTooltip('Copy response'));
    await tester.pumpAndSettle();

    expect(
      clipboardCalls.where((call) => call.method == 'Clipboard.setData'),
      hasLength(1),
    );
    final clipboardCall = clipboardCalls
        .singleWhere((call) => call.method == 'Clipboard.setData');
    expect(
      (clipboardCall.arguments as Map)['text'],
      message.content,
    );
    expect(find.text('Copied to clipboard'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('keeps user messages as selectable plain text', (tester) async {
    final message = ChatMessage(
      id: 'user-1',
      role: ChatMessageRole.user,
      content: '**literal user text**',
      createdAt: DateTime.utc(2026, 1, 1),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageBubble(message: message),
        ),
      ),
    );

    expect(find.text('**literal user text**'), findsOneWidget);
    expect(find.byTooltip('Copy response'), findsNothing);
  });
}
