import '../request_interceptor.dart';
import '../request_metadata.dart';

final class LocaleInterceptor implements RequestInterceptor {
  LocaleInterceptor(this._languageTag);

  final String Function() _languageTag;

  @override
  Map<String, String> headersFor(RequestMetadata metadata) {
    final tag = _languageTag().trim();
    return tag.isEmpty ? const {} : {'accept-language': tag};
  }
}
