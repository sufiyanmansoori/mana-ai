final class SettingsRecordModel {
  const SettingsRecordModel({required this.id, required this.createdAt});

  factory SettingsRecordModel.fromJson(Map<String, Object?> json) {
    final id = json['id'];
    final timestamp = json['createdAt'];
    if (id is! String || id.trim().isEmpty || timestamp is! String) {
      throw const FormatException('Record JSON has invalid required fields.');
    }
    final createdAt = DateTime.tryParse(timestamp);
    if (createdAt == null) {
      throw const FormatException('Record timestamp is not a valid date.');
    }
    return SettingsRecordModel(id: id, createdAt: createdAt);
  }

  final String id;
  final DateTime createdAt;

  Map<String, Object?> toJson() => {
        'id': id,
        'createdAt': createdAt.toUtc().toIso8601String(),
      };
}
