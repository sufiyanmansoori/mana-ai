abstract final class UrlUtils {
  static Uri parseHttpUrl(String input) {
    final uri = Uri.tryParse(input.trim());
    if (uri == null ||
        (uri.scheme != 'https' && uri.scheme != 'http') ||
        uri.host.isEmpty ||
        uri.userInfo.isNotEmpty) {
      throw const FormatException('Expected a valid HTTP(S) URL.');
    }
    return uri;
  }

  static Uri withoutCredentials(Uri uri) =>
      uri.replace(userInfo: '', queryParameters: uri.queryParametersAll);
}
