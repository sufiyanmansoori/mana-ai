import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/app.dart';
import 'package:mana_ai_app/core/config/app_config.dart';
import 'package:mana_ai_app/features/chat/data/repositories/local_chat_repository.dart';
import 'package:mana_ai_app/features/chat/presentation/chat_controller.dart';

void main() {
  Future<void> pumpApp(WidgetTester tester) async {
    await tester.pumpWidget(
      ManaAiApp(
        config: AppConfig(
          environment: AppEnvironment.development,
          apiBaseUri: null,
        ),
        chatController: ChatController(LocalChatRepository()),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('renders the Mana AI chat home and sends a local message',
      (tester) async {
    await pumpApp(tester);

    expect(find.text('Mana AI'), findsOneWidget);
    expect(find.text('Good to see you.'), findsOneWidget);
    expect(find.text('New chat'), findsOneWidget);
    expect(find.text('Images'), findsOneWidget);
    expect(find.text('Library'), findsOneWidget);
    expect(find.text('Local preview'), findsOneWidget);

    await tester.enterText(find.byType(TextField).last, 'Hello Mana');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    expect(find.text('Hello Mana'), findsNWidgets(2));
    expect(tester.takeException(), isNull);
  });

  testWidgets('keeps invalid input in the composer and announces the error',
      (tester) async {
    await pumpApp(tester);
    await tester.enterText(find.byType(TextField).last, 'bad\u0000input');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    expect(
      find.text(
        'The message could not be sent. Check its length and content.',
      ),
      findsOneWidget,
    );
    expect(find.text('bad\u0000input'), findsOneWidget);
  });

  testWidgets('starts a separate conversation and keeps the previous one',
      (tester) async {
    await pumpApp(tester);
    await tester.enterText(find.byType(TextField).last, 'First conversation');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('New chat').first);
    await tester.pumpAndSettle();
    expect(find.text('Good to see you.'), findsOneWidget);

    await tester.enterText(find.byType(TextField).last, 'Second conversation');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    expect(find.text('First conversation'), findsOneWidget);
    expect(find.text('Second conversation'), findsNWidgets(2));

    await tester.tap(find.text('First conversation').first);
    await tester.pumpAndSettle();
    expect(find.text('First conversation'), findsNWidgets(3));
  });

  testWidgets('searches recent conversations from the sidebar', (tester) async {
    await pumpApp(tester);
    await tester.enterText(find.byType(TextField).last, 'Project launch plan');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Search chats').first);
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField).first, 'launch');
    await tester.pumpAndSettle();

    expect(find.text('Project launch plan'), findsOneWidget);
    expect(find.text('Search results'), findsOneWidget);
  });

  testWidgets('shows backend setup instead of claiming unavailable tools work',
      (tester) async {
    await pumpApp(tester);
    await tester.tap(find.text('Images'));
    await tester.pumpAndSettle();

    expect(find.text('Images'), findsWidgets);
    expect(find.text('Backend setup required'), findsOneWidget);
    expect(
      find.textContaining('Connect a secure image generation service'),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('keeps the chat workspace usable on a narrow viewport',
      (tester) async {
    tester.view.physicalSize = const Size(560, 360);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await pumpApp(tester);
    expect(find.byTooltip('Open navigation'), findsOneWidget);
    expect(find.text('Good to see you.'), findsOneWidget);
    expect(tester.takeException(), isNull);

    await tester.tap(find.byTooltip('Open navigation'));
    await tester.pumpAndSettle();
    expect(find.text('Images'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
