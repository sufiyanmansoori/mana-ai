import 'dart:async';

import 'package:flutter/material.dart';

import 'core/config/app_config.dart';
import 'core/l10n/generated/app_localizations.dart';
import 'core/theme/app_theme.dart';
import 'features/admin/presentation/controllers/feature_flags_controller.dart';
import 'features/image_generation/data/datasources/image_generation_api_data_source.dart';
import 'features/chat/presentation/chat_controller.dart';
import 'features/chat/presentation/controllers/chat_session_controller.dart';
import 'features/chat/presentation/pages/chat_page.dart';
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
    this.modelIds = const [],
    this.createChatSession,
    this.initialConversationId,
    this.startupMessage,
    this.adminFeatureFlagsController,
    this.imageGenerationDataSource,
    this.onDispose,
    super.key,
  });

  final AppConfig config;
  final ChatController chatController;
  final ChatSessionController? chatSessionController;
  final String chatModel;
  final List<String> modelIds;
  final ChatSessionController Function(String conversationId)?
      createChatSession;
  final String? initialConversationId;
  final String? startupMessage;
  final AdminFeatureFlagsController? adminFeatureFlagsController;
  final ImageGenerationApiDataSource? imageGenerationDataSource;
  final Future<void> Function()? onDispose;

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
          builder: (context) => ChatPage(
            controller: widget.chatController,
            chatSessionController: widget.chatSessionController,
            createChatSession: widget.createChatSession,
            initialConversationId: widget.initialConversationId,
            model: widget.chatModel,
            models: widget.modelIds,
            startupMessage: widget.startupMessage,
            adminFeatureFlagsController: widget.adminFeatureFlagsController,
            imageGenerationDataSource: widget.imageGenerationDataSource,
          ),
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
    widget.adminFeatureFlagsController?.dispose();
    final cleanup = widget.onDispose?.call();
    if (cleanup != null) unawaited(cleanup);
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
