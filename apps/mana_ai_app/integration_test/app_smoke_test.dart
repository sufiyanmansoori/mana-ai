import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:mana_ai_app/main_dev.dart' as mana_app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('development entrypoint renders and accepts a chat message',
      (tester) async {
    mana_app.main();
    await tester.pumpAndSettle();

    expect(find.text('Mana AI'), findsOneWidget);
    expect(
      find.text('Messages stay in this session. No server is connected.'),
      findsOneWidget,
    );

    await tester.enterText(find.byType(TextField), 'Integration smoke test');
    await tester.tap(find.byTooltip('Send message'));
    await tester.pumpAndSettle();

    expect(find.text('Integration smoke test'), findsOneWidget);
  });
}
