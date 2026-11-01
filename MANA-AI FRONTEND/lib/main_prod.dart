import 'bootstrap.dart';
import 'core/config/app_config.dart';

Future<void> main() =>
    bootstrap(expectedEnvironment: AppEnvironment.production);
