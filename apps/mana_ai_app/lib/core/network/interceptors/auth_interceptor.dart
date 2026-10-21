import '../../storage/secure_key_value_store.dart';
import '../request_interceptor.dart';
import '../request_metadata.dart';

final class AuthInterceptor implements RequestInterceptor {
  AuthInterceptor(this._storage);

  final SecureKeyValueStore _storage;

  @override
  Map<String, String> headersFor(RequestMetadata metadata) {
    final token = _storage.readAccessTokenSync()?.trim();
    if (token == null || token.isEmpty) return const {};
    return {'authorization': 'Bearer $token'};
  }
}
