import 'app_config.dart';

abstract final class ProdConfig {
  static AppConfig create({required Uri apiBaseUri}) => AppConfig(
        environment: AppEnvironment.production,
        apiBaseUri: apiBaseUri,
      );
}
