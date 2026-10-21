import 'package:flutter/material.dart';

import 'core/config/app_config.dart';
import 'core/l10n/generated/app_localizations.dart';
import 'core/theme/app_theme.dart';
import 'features/chat/presentation/chat_controller.dart';
import 'features/chat/presentation/controllers/chat_session_controller.dart';
import 'features/chat/presentation/pages/chat_page.dart';
import 'features/chat/presentation/screens/chat_screen.dart';
import 'routing/app_route.dart';
import 'routing/app_router.dart';
import 'routing/auth_guard.dart';
import 'routing/route_names.dart';

class ManaAiApp extends StatefulWidget {
  const ManaAiApp({
    required this.config,
    required this.chatController,
    this.chatSessionController,
    this.chatModel = 'default',
    super.key,
  });

  final AppConfig config;
  final ChatController chatController;
  final ChatSessionController? chatSessionController;
  final String chatModel;

  @override
  State<ManaAiApp> createState() => _ManaAiAppState();
}

class _ManaAiAppState extends State<ManaAiApp> {
  late final AppRouter _router;

  @override
  void initState() {
    super.initState();
    _router = AppRouter(
      routes: [
        AppRoute(
          name: RouteNames.chat,
          builder: (context) {
            final sessionController = widget.chatSessionController;
            if (sessionController != null) {
              return ChatScreen(
                controller: sessionController,
                model: widget.chatModel,
              );
            }
            return ChatPage(controller: widget.chatController);
          },
        ),
      ],
      authGuard: AuthGuard(isAuthenticated: () => false),
      notFoundBuilder: (context) => Scaffold(
        appBar: AppBar(title: Text(AppLocalizations.of(context).appTitle)),
        body: const Center(
          child: Icon(Icons.error_outline, size: 40),
        ),
      ),
    );
  }

  @override
  void dispose() {
    widget.chatController.dispose();
    widget.chatSessionController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      onGenerateTitle: (context) => AppLocalizations.of(context).appTitle,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      initialRoute: RouteNames.chat,
      onGenerateRoute: _router.onGenerateRoute,
    );
  }
}
