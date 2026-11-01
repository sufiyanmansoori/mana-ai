import 'app_config.dart';

abstract final class DevConfig {
  static AppConfig create({Uri? apiBaseUri}) => AppConfig(
        environment: AppEnvironment.development,
        apiBaseUri: apiBaseUri,
      );
}
