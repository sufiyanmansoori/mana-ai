final class AdminFeatureFlag {
  const AdminFeatureFlag({
    required this.key,
    required this.description,
    required this.enabled,
    required this.createdAt,
    required this.updatedAt,
    required this.updatedBy,
  });

  final String key;
  final String description;
  final bool enabled;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String updatedBy;

  factory AdminFeatureFlag.fromJson(Map<String, Object?> json) {
    final key = json['key'];
    final description = json['description'];
    final enabled = json['enabled'];
    final createdAt = _parseDate(json['created_at']);
    final updatedAt = _parseDate(json['updated_at']);
    final updatedBy = json['updated_by'];
    if (key is! String ||
        !RegExp(r'^[a-z][a-z0-9_.-]{1,63}$').hasMatch(key) ||
        description is! String ||
        description.isEmpty ||
        enabled is! bool ||
        createdAt == null ||
        updatedAt == null ||
        updatedBy is! String ||
        updatedBy.isEmpty) {
      throw const FormatException('The API returned an invalid feature flag.');
    }

    return AdminFeatureFlag(
      key: key,
      description: description,
      enabled: enabled,
      createdAt: createdAt,
      updatedAt: updatedAt,
      updatedBy: updatedBy,
    );
  }

  static DateTime? _parseDate(Object? value) =>
      value is String ? DateTime.tryParse(value)?.toUtc() : null;
}

final class AdminFeatureFlagAuditEntry {
  const AdminFeatureFlagAuditEntry({
    required this.id,
    required this.key,
    required this.action,
    required this.actorSubject,
    required this.occurredAt,
  });

  final String id;
  final String key;
  final String action;
  final String actorSubject;
  final DateTime occurredAt;

  factory AdminFeatureFlagAuditEntry.fromJson(Map<String, Object?> json) {
    final id = json['id'];
    final key = json['key'];
    final action = json['action'];
    final actor = json['actor_subject'];
    final occurredAt = json['occurred_at'];
    if (id is! String ||
        key is! String ||
        action is! String ||
        !const {'created', 'updated', 'deleted'}.contains(action) ||
        actor is! String ||
        occurredAt is! String ||
        DateTime.tryParse(occurredAt) == null) {
      throw const FormatException('The API returned an invalid audit entry.');
    }

    return AdminFeatureFlagAuditEntry(
      id: id,
      key: key,
      action: action,
      actorSubject: actor,
      occurredAt: DateTime.parse(occurredAt).toUtc(),
    );
  }
}
