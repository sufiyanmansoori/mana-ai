import 'request_metadata.dart';

abstract interface class RequestInterceptor {
  Map<String, String> headersFor(RequestMetadata metadata);
}