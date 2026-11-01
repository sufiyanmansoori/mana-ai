import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import 'app.dart';
import 'core/config/api_endpoint.dart';
import 'core/config/app_config.dart';
import 'core/di/service_registry.dart';
import 'core/network/development_api_session.dart';
import 'core/security/sensitive_data_redactor.dart';
import 'core/services/secure_id_generator.dart';
import 'core/storage/secure_storage.dart';
import 'features/chat/application/chat_session_factory.dart';
import 'features/chat/data/datasources/chat_database.dart';
import 'features/chat/data/repositories/local_chat_repository.dart';
import 'features/chat/domain/repositories/chat_repository.dart';
import 'features/chat/presentation/chat_controller.dart';
import 'features/chat/presentation/controllers/chat_session_controller.dart';
import 'features/admin/application/feature_service.dart';
import 'features/admin/data/datasources/feature_flags_api_data_source.dart';
import 'features/admin/data/repositories/feature_flag_repository_impl.dart';
import 'features/admin/presentation/controllers/feature_flags_controller.dart';
import 'features/image_generation/data/datasources/image_generation_api_data_source.dart';

Future<void> bootstrap({AppEnvironment? expectedEnvironment}) async {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    debugPrint(
      'Flutter framework error: '
      '${SensitiveDataRedactor.redact(details.exceptionAsString())}',
    );
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint(
      'Uncaught platform error: '
      '${SensitiveDataRedactor.redact('$error\n$stack')}',
    );
    return false;
  };

  final config = AppConfig.fromEnvironment();
  if (expectedEnvironment != null &&
      config.environment != expectedEnvironment) {
    throw StateError(
      'The selected entrypoint requires ${expectedEnvironment.name}, but '
      '${config.environment.name} was configured.',
    );
  }
  if (!config.isDevelopment) {
    throw UnsupportedError(
      'Remote chat is not configured. Run this in development until an API '
      'transport and authenticated backend are available.',
    );
  }

  final services = ServiceRegistry();
  services.registerSingleton<ChatRepository>(LocalChatRepository());
  services.registerSingleton<ChatController>(
    ChatController(services.get<ChatRepository>()),
  );

  final apiUri = config.apiBaseUri;
  ChatSessionController? chatSessionController;
  AdminFeatureFlagsController? adminFeatureFlagsController;
  ImageGenerationApiDataSource? imageGenerationDataSource;
  ChatDatabase? database;
  http.Client? apiClient;
  ChatSessionController Function(String conversationId)? createChatSession;
  String? initialConversationId;
  final chatSessions = <ChatSessionController>{};
  var models = const <String>[];
  var chatModel = 'gpt-4o-mini';
  String? startupMessage;

  if (apiUri != null) {
    final secureStorage = PlatformSecureStorage();
    await secureStorage.initialize();
    final sessionClient = http.Client();
    apiClient = sessionClient;
    try {
      final apiEndpoint = ApiEndpoint(apiUri.toString());
      final sessionDatabase = ChatDatabase();
      database = sessionDatabase;
      final sessionSecureStorage = secureStorage;
      models = await DevelopmentApiSession(
        endpoint: apiEndpoint,
        client: sessionClient,
        secureStorage: secureStorage,
      ).authenticateAndLoadModels();
      chatModel = models.first;
      adminFeatureFlagsController = AdminFeatureFlagsController(
        RepositoryAdminFeatureService(
          AdminFeatureFlagRepositoryImpl(
            AdminFeatureFlagsApiDataSource(
              endpoint: apiEndpoint,
              client: sessionClient,
              secureStorage: secureStorage,
            ),
          ),
        ),
      );
      imageGenerationDataSource = ImageGenerationApiDataSource(
        endpoint: apiEndpoint,
        client: sessionClient,
        secureStorage: secureStorage,
      );
      ChatSessionController createSession(String conversationId) {
        final session = ChatSessionFactory.create(
          database: sessionDatabase,
          endpoint: apiEndpoint,
          client: sessionClient,
          secureStorage: sessionSecureStorage,
          conversationId: conversationId,
        );
        chatSessions.add(session);
        return session;
      }

      createChatSession = createSession;
      final conversationId = SecureIdGenerator().nextUuid();
      initialConversationId = conversationId;
      chatSessionController = createSession(conversationId);
      await chatSessionController.initialize();
    } on DevelopmentApiException catch (error) {
      startupMessage = error.message;
      for (final session in chatSessions) {
        session.dispose();
      }
      chatSessions.clear();
      createChatSession = null;
      initialConversationId = null;
      apiClient.close();
      apiClient = null;
      if (database != null) {
        await database.close();
        database = null;
      }
    }
  }

  runApp(
    ManaAiApp(
      config: config,
      chatController: services.get<ChatController>(),
      chatSessionController: chatSessionController,
      chatModel: chatModel,
      modelIds: models,
      createChatSession: createChatSession,
      initialConversationId: initialConversationId,
      startupMessage: startupMessage,
      adminFeatureFlagsController: adminFeatureFlagsController,
      imageGenerationDataSource: imageGenerationDataSource,
      onDispose: () async {
        for (final session in chatSessions) {
          session.dispose();
        }
        chatSessions.clear();
        apiClient?.close();
        await database?.close();
      },
    ),
  );
}
