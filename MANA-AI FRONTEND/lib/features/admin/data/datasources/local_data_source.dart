import 'dart:async';
import 'dart:convert';

import 'package:mana_ai_app/core/storage/preferences_storage.dart';
import 'package:mana_ai_app/features/admin/data/models/record_model.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

abstract interface class AdminLocalDataSource {
  Future<List<AdminRecord>> readAll();

  Future<AdminRecord?> getById(String id);

  Future<void> save(AdminRecord record);

  Future<void> delete(String id);
}

final class PreferencesAdminLocalDataSource implements AdminLocalDataSource {
  PreferencesAdminLocalDataSource({
    required PreferencesStorage preferences,
    this.storageKey = defaultStorageKey,
    this.maximumRecords = defaultMaximumRecords,
    this.maximumStorageBytes = defaultMaximumStorageBytes,
  }) : _preferences = preferences {
    if (storageKey.trim().isEmpty || storageKey.length > 128) {
      throw ArgumentError.value(storageKey, 'storageKey');
    }
    if (maximumRecords < 1) {
      throw ArgumentError.value(maximumRecords, 'maximumRecords');
    }
    if (maximumStorageBytes < 1) {
      throw ArgumentError.value(maximumStorageBytes, 'maximumStorageBytes');
    }
  }

  static const defaultStorageKey = 'mana_ai.admin.records.v1';
  static const defaultMaximumRecords = 5000;
  static const defaultMaximumStorageBytes = 1024 * 1024;
  static const _schemaVersion = 1;
  static final _controlCharacters = RegExp(r'[\u0000-\u001F\u007F]');

  final PreferencesStorage _preferences;
  final String storageKey;
  final int maximumRecords;
  final int maximumStorageBytes;

  Future<void> _operationTail = Future<void>.value();

  @override
  Future<List<AdminRecord>> readAll() => _exclusive(() async {
        final records = await _readRecords();
        records.sort(_compareRecords);
        return List.unmodifiable(records);
      });

  @override
  Future<AdminRecord?> getById(String id) {
    final normalizedId = _normalizeId(id);
    return _exclusive(() async {
      final records = await _readRecords();
      for (final record in records) {
        if (record.id == normalizedId) return record;
      }
      return null;
    });
  }

  @override
  Future<void> save(AdminRecord record) {
    final normalizedRecord = _normalizeRecord(record);
    return _exclusive(() async {
      final records = await _readRecords();
      final index = records.indexWhere(
        (existing) => existing.id == normalizedRecord.id,
      );
      if (index == -1) {
        if (records.length >= maximumRecords) {
          throw StateError('The local admin record limit has been reached.');
        }
        records.add(normalizedRecord);
      } else {
        records[index] = normalizedRecord;
      }
      await _writeRecords(records);
    });
  }

  @override
  Future<void> delete(String id) {
    final normalizedId = _normalizeId(id);
    return _exclusive(() async {
      final records = await _readRecords();
      final remaining = records
          .where((record) => record.id != normalizedId)
          .toList(growable: false);
      if (remaining.length == records.length) return;
      await _writeRecords(remaining);
    });
  }

  Future<List<AdminRecord>> _readRecords() async {
    final storedValue = await _preferences.readString(storageKey);
    if (storedValue == null) return <AdminRecord>[];
    if (utf8.encode(storedValue).length > maximumStorageBytes) {
      throw const FormatException('Local admin data exceeds its size limit.');
    }

    final Object? decoded;
    try {
      decoded = jsonDecode(storedValue);
    } on FormatException {
      throw const FormatException('Local admin data is not valid JSON.');
    }
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Local admin data has an invalid format.');
    }

    final version = decoded['schemaVersion'];
    final recordsJson = decoded['records'];
    if (version != _schemaVersion || recordsJson is! List<Object?>) {
      throw const FormatException(
        'Local admin data uses an unsupported schema.',
      );
    }
    if (recordsJson.length > maximumRecords) {
      throw const FormatException('Local admin data exceeds its record limit.');
    }

    final records = <AdminRecord>[];
    final ids = <String>{};
    for (final item in recordsJson) {
      if (item is! Map<String, dynamic>) {
        throw const FormatException(
          'Local admin data contains an invalid record.',
        );
      }
      final model = AdminRecordModel.fromJson(item);
      final normalizedId = _normalizeId(model.id);
      if (normalizedId != model.id || !ids.add(normalizedId)) {
        throw const FormatException(
          'Local admin data contains an invalid or duplicate record ID.',
        );
      }
      records.add(
        AdminRecord(
          id: normalizedId,
          createdAt: model.createdAt.toUtc(),
        ),
      );
    }
    return records;
  }

  Future<void> _writeRecords(List<AdminRecord> records) async {
    final payload = jsonEncode({
      'schemaVersion': _schemaVersion,
      'records': [
        for (final record in records)
          AdminRecordModel(
            id: record.id,
            createdAt: record.createdAt,
          ).toJson(),
      ],
    });
    if (utf8.encode(payload).length > maximumStorageBytes) {
      throw StateError('Local admin data exceeds its configured size limit.');
    }
    await _preferences.writeString(storageKey, payload);
  }

  Future<T> _exclusive<T>(Future<T> Function() operation) async {
    final previousOperation = _operationTail;
    final completed = Completer<void>();
    _operationTail = completed.future;
    await previousOperation;
    try {
      return await operation();
    } finally {
      completed.complete();
    }
  }

  AdminRecord _normalizeRecord(AdminRecord record) {
    if (!record.createdAt.isUtc) {
      return AdminRecord(
        id: _normalizeId(record.id),
        createdAt: record.createdAt.toUtc(),
      );
    }
    return AdminRecord(
      id: _normalizeId(record.id),
      createdAt: record.createdAt,
    );
  }

  String _normalizeId(String id) {
    final normalizedId = id.trim();
    if (normalizedId.isEmpty ||
        normalizedId.length > 128 ||
        _controlCharacters.hasMatch(normalizedId)) {
      throw ArgumentError.value(
        id,
        'id',
        'Record IDs must contain 1–128 printable characters.',
      );
    }
    return normalizedId;
  }

  int _compareRecords(AdminRecord left, AdminRecord right) {
    final newestFirst = right.createdAt.compareTo(left.createdAt);
    return newestFirst != 0 ? newestFirst : left.id.compareTo(right.id);
  }
}
