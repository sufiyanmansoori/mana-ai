import 'dart:typed_data';

final class ProcessedImage {
  const ProcessedImage({
    required this.bytes,
    required this.mediaType,
    required this.width,
    required this.height,
  });

  final Uint8List bytes;
  final String mediaType;
  final int width;
  final int height;
}

abstract interface class ImageProcessingService {
  Future<ProcessedImage> normalize(
    Uint8List image, {
    required int maximumDimension,
    required int maximumBytes,
  });
}