import 'app_config.dart';

abstract final class StagingConfig {
  static AppConfig create({required Uri apiBaseUri}) => AppConfig(
        environment: AppEnvironment.staging,
        apiBaseUri: apiBaseUri,
      );
}
