final class AttachmentReference {
  const AttachmentReference({
    required this.id,
    required this.name,
    required this.mediaType,
    required this.byteLength,
  })  : assert(id != ''),
        assert(name != ''),
        assert(byteLength >= 0);

  final String id;
  final String name;
  final String mediaType;
  final int byteLength;
}
