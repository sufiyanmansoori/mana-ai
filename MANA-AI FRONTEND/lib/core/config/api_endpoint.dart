final class ApiEndpoint {
  ApiEndpoint(String baseUrl) : baseUri = Uri.parse(baseUrl.trim()) {
    validateBaseUri(baseUri);
  }

  final Uri baseUri;

  static void validateBaseUri(Uri uri) {
    if ((uri.scheme != 'https' && uri.scheme != 'http') ||
        uri.host.isEmpty ||
        uri.userInfo.isNotEmpty ||
        uri.hasQuery ||
        uri.hasFragment) {
      throw const FormatException(
        'API base URL must be an HTTP(S) origin or path.',
      );
    }
  }

  Uri resolve(String relativePath) {
    final path = relativePath.trim();
    final relativeUri = Uri.parse(path);
    if (path.isEmpty ||
        path.startsWith('/') ||
        relativeUri.hasScheme ||
        relativeUri.hasAuthority ||
        relativeUri.hasQuery ||
        relativeUri.hasFragment ||
        relativeUri.pathSegments.contains('..')) {
      throw ArgumentError.value(
        relativePath,
        'relativePath',
        'Expected a safe relative API path.',
      );
    }

    final basePath = baseUri.path.replaceFirst(RegExp(r'/+$'), '');
    return baseUri.replace(path: '$basePath/$path');
  }
}
