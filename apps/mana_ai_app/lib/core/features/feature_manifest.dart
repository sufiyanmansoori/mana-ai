final class FeatureManifest {
  const FeatureManifest({
    required this.id,
    required this.title,
    this.description = '',
    this.initiallyEnabled = true,
  })  : assert(id != ''),
        assert(title != '');

  final String id;
  final String title;
  final String description;
  final bool initiallyEnabled;
}