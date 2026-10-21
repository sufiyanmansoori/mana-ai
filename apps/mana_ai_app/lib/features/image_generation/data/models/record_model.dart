final class ImageGenerationRecordModel {
  const ImageGenerationRecordModel({required this.id, required this.createdAt});

  factory ImageGenerationRecordModel.fromJson(Map<String, Object?> json) {
    final id = json['id'];
    final timestamp = json['createdAt'];
    if (id is! String || id.trim().isEmpty || timestamp is! String) {
      throw const FormatException('Record JSON has invalid required fields.');
    }
    final createdAt = DateTime.tryParse(timestamp);
    if (createdAt == null) {
      throw const FormatException('Record timestamp is not a valid date.');
    }
    return ImageGenerationRecordModel(id: id, createdAt: createdAt);
  }

  final String id;
  final DateTime createdAt;

  Map<String, Object?> toJson() => {
        'id': id,
        'createdAt': createdAt.toUtc().toIso8601String(),
      };
}
