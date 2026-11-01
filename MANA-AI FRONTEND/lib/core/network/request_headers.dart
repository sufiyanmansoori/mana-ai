import 'request_interceptor.dart';
import 'request_metadata.dart';

final class RequestHeaders {
  RequestHeaders({
    required Iterable<RequestInterceptor> interceptors,
  }) : _interceptors = List.unmodifiable(interceptors);

  final List<RequestInterceptor> _interceptors;

  Map<String, String> build(
    RequestMetadata metadata, {
    Map<String, String> base = const {},
  }) {
    final headers = <String, String>{
      'accept': 'application/json',
      'x-request-id': metadata.requestId,
      ...base,
    };
    for (final interceptor in _interceptors) {
      headers.addAll(interceptor.headersFor(metadata));
    }
    return Map.unmodifiable(headers);
  }
}

final class LocaleHeaderInterceptor implements RequestInterceptor {
  LocaleHeaderInterceptor(this.locale);

  final String Function() locale;

  @override
  Map<String, String> headersFor(RequestMetadata metadata) {
    final value = locale().trim();
    return value.isEmpty ? const {} : {'accept-language': value};
  }
}
