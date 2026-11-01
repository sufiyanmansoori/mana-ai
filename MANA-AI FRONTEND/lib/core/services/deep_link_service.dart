abstract interface class DeepLinkService {
  Uri? parseAllowedLink(String value);
}

final class AllowlistedDeepLinkService implements DeepLinkService {
  AllowlistedDeepLinkService({
    required Set<String> allowedHosts,
    required Set<String> allowedSchemes,
  })  : _allowedHosts = Set.unmodifiable(allowedHosts),
        _allowedSchemes = Set.unmodifiable(allowedSchemes);

  final Set<String> _allowedHosts;
  final Set<String> _allowedSchemes;

  @override
  Uri? parseAllowedLink(String value) {
    final uri = Uri.tryParse(value.trim());
    if (uri == null ||
        !_allowedSchemes.contains(uri.scheme) ||
        !_allowedHosts.contains(uri.host.toLowerCase()) ||
        uri.userInfo.isNotEmpty) {
      return null;
    }
    return uri;
  }
}