import 'dart:typed_data';

final class ProcessedDocument {
  const ProcessedDocument({
    required this.name,
    required this.mediaType,
    required this.byteLength,
    required this.sha256,
  });

  final String name;
  final String mediaType;
  final int byteLength;
  final String sha256;
}

abstract interface class DocumentProcessingService {
  Future<ProcessedDocument> validate(
    String name,
    String mediaType,
    Uint8List bytes, {
    required int maximumBytes,
    required Set<String> allowedMediaTypes,
  });
}
