import 'api_endpoint.dart';
import 'environment.dart';

export 'environment.dart';

final class AppConfig {
  factory AppConfig({
    required AppEnvironment environment,
    required Uri? apiBaseUri,
  }) {
    if (apiBaseUri != null) {
      ApiEndpoint.validateBaseUri(apiBaseUri);
    }
    if (environment == AppEnvironment.production &&
        (apiBaseUri == null || apiBaseUri.scheme != 'https')) {
      throw ArgumentError(
        'Production requires an HTTPS API_BASE_URL.',
        'apiBaseUri',
      );
    }
    if (environment == AppEnvironment.staging && apiBaseUri == null) {
      throw ArgumentError(
        'Staging requires an API_BASE_URL.',
        'apiBaseUri',
      );
    }

    return AppConfig._(
      environment: environment,
      apiBaseUri: apiBaseUri?.replace(
        path: apiBaseUri.path.replaceFirst(RegExp(r'/+$'), ''),
      ),
    );
  }

  const AppConfig._({
    required this.environment,
    required this.apiBaseUri,
  });

  factory AppConfig.fromEnvironment() {
    const environmentValue = String.fromEnvironment(
      'APP_ENV',
      defaultValue: 'development',
    );
    const apiBaseUrl = String.fromEnvironment('API_BASE_URL');
    final trimmedUrl = apiBaseUrl.trim();
    final environment = AppEnvironment.parse(environmentValue);

    return AppConfig(
      environment: environment,
      apiBaseUri: trimmedUrl.isNotEmpty
          ? Uri.parse(trimmedUrl)
          : environment == AppEnvironment.development
              ? Uri.parse('http://127.0.0.1:3000')
              : null,
    );
  }

  final AppEnvironment environment;
  final Uri? apiBaseUri;

  bool get isDevelopment => environment == AppEnvironment.development;

  bool get isProduction => environment == AppEnvironment.production;
}
