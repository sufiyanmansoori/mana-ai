import '../../security/sensitive_data_redactor.dart';
import '../request_interceptor.dart';
import '../request_metadata.dart';

typedef NetworkLogSink = void Function(String message);

final class LoggingInterceptor implements RequestInterceptor {
  LoggingInterceptor(this._sink);

  final NetworkLogSink _sink;

  void logRequest(RequestMetadata metadata, String method, Uri uri) {
    _sink(
      SensitiveDataRedactor.redact(
        'request id=${metadata.requestId} attempt=${metadata.attempt} '
        'method=$method uri=${uri.origin}${uri.path}',
      ),
    );
  }

  @override
  Map<String, String> headersFor(RequestMetadata metadata) => const {};
}
