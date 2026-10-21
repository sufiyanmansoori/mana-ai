import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import 'app.dart';
import 'core/config/app_config.dart';
import 'core/di/service_registry.dart';
import 'core/security/sensitive_data_redactor.dart';
import 'features/chat/data/repositories/local_chat_repository.dart';
import 'features/chat/domain/repositories/chat_repository.dart';
import 'features/chat/presentation/chat_controller.dart';

void bootstrap({AppEnvironment? expectedEnvironment}) {
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

  runApp(
    ManaAiApp(
      config: config,
      chatController: services.get<ChatController>(),
    ),
  );
}
