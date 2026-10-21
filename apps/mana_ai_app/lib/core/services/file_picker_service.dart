import 'dart:typed_data';

final class PickedFileData {
  const PickedFileData({
    required this.name,
    required this.bytes,
    required this.mediaType,
  });

  final String name;
  final Uint8List bytes;
  final String mediaType;

  int get sizeInBytes => bytes.lengthInBytes;
}

abstract interface class FilePickerService {
  Future<List<PickedFileData>> pickFiles({
    required int maximumFiles,
    required int maximumBytesPerFile,
    Set<String> allowedExtensions,
  });
}