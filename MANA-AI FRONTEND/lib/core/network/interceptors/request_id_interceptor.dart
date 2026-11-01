import '../../services/secure_id_generator.dart';
import '../request_interceptor.dart';
import '../request_metadata.dart';

final class RequestIdInterceptor implements RequestInterceptor {
  RequestIdInterceptor({SecureIdGenerator? idGenerator})
      : _idGenerator = idGenerator ?? SecureIdGenerator();

  final SecureIdGenerator _idGenerator;

  RequestMetadata createMetadata(DateTime startedAt, {int attempt = 1}) =>
      RequestMetadata(
        requestId: _idGenerator.nextUuid(),
        startedAt: startedAt,
        attempt: attempt,
      );

  @override
  Map<String, String> headersFor(RequestMetadata metadata) =>
      {'x-request-id': metadata.requestId};
}
