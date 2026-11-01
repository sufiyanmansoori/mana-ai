import 'package:mana_ai_app/features/admin/data/models/record_model.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

abstract final class AdminRecordMapper {
  static final _controlCharacters = RegExp(r'[\u0000-\u001F\u007F]');

  static AdminRecord fromModel(
    AdminRecordModel model,
  ) {
    final id = _normalizeId(model.id, isModel: true);
    return AdminRecord(
      id: id,
      createdAt: model.createdAt.toUtc(),
    );
  }

  static List<AdminRecord> fromModels(
    Iterable<AdminRecordModel> models,
  ) {
    final records = <AdminRecord>[];
    for (final model in models) {
      try {
        records.add(fromModel(model));
      } on FormatException catch (error) {
        throw FormatException(
          'Invalid admin record model at index ${records.length}: '
          '${error.message}',
        );
      }
    }
    return List.unmodifiable(records);
  }

  static AdminRecordModel toModel(
    AdminRecord record,
  ) {
    final id = _normalizeId(record.id, isModel: false);
    return AdminRecordModel(
      id: id,
      createdAt: record.createdAt.toUtc(),
    );
  }

  static List<AdminRecordModel> toModels(
    Iterable<AdminRecord> records,
  ) {
    final models = <AdminRecordModel>[];
    for (final record in records) {
      try {
        models.add(toModel(record));
      } on ArgumentError catch (error) {
        throw ArgumentError(
          'Invalid admin record at index ${models.length}: ${error.message}',
        );
      }
    }
    return List.unmodifiable(models);
  }

  static String _normalizeId(
    String value, {
    required bool isModel,
  }) {
    final normalized = value.trim();
    if (normalized.isEmpty ||
        normalized.length > 128 ||
        _controlCharacters.hasMatch(normalized)) {
      if (isModel) {
        throw const FormatException(
          'Record ID must contain 1–128 printable characters.',
        );
      }
      throw ArgumentError.value(
        value,
        'record.id',
        'Must contain 1–128 printable characters.',
      );
    }
    return normalized;
  }
}
