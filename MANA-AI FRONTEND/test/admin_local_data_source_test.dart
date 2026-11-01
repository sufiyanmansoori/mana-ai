import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/core/storage/preferences_storage.dart';
import 'package:mana_ai_app/features/admin/data/datasources/local_data_source.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

void main() {
  late _MemoryPreferences preferences;
  late PreferencesAdminLocalDataSource dataSource;

  setUp(() {
    preferences = _MemoryPreferences();
    dataSource = PreferencesAdminLocalDataSource(
      preferences: preferences,
    );
  });

  test('returns an immutable empty list when no records are stored', () async {
    final records = await dataSource.readAll();

    expect(records, isEmpty);
    expect(() => records.add(_record('record-1')), throwsUnsupportedError);
  });

  test('saves, updates, sorts, and reads records by ID', () async {
    await dataSource.save(_record('older', createdAt: DateTime.utc(2025)));
    await dataSource.save(_record('newer', createdAt: DateTime.utc(2026)));
    await dataSource.save(_record('older', createdAt: DateTime.utc(2027)));

    expect(
      (await dataSource.readAll()).map((record) => record.id),
      ['older', 'newer'],
    );
    expect(
      (await dataSource.getById(' newer '))?.createdAt,
      DateTime.utc(2026),
    );
    expect(await dataSource.getById('missing'), isNull);
  });

  test('serializes concurrent writes without losing records', () async {
    await Future.wait([
      for (var index = 0; index < 20; index++)
        dataSource.save(_record('record-$index')),
    ]);

    expect(await dataSource.readAll(), hasLength(20));
  });

  test('deleting an unknown record is idempotent', () async {
    await dataSource.save(_record('keep'));

    await dataSource.delete('missing');

    expect((await dataSource.readAll()).single.id, 'keep');
  });

  test('writes are persisted for a newly created datasource instance',
      () async {
    await dataSource.save(_record('persistent'));
    final reopened = PreferencesAdminLocalDataSource(
      preferences: preferences,
    );

    expect((await reopened.readAll()).single.id, 'persistent');
  });

  test('rejects invalid IDs and enforces the record limit', () async {
    expect(
      () => dataSource.save(_record(' \n ')),
      throwsArgumentError,
    );

    final limited = PreferencesAdminLocalDataSource(
      preferences: preferences,
      maximumRecords: 1,
    );
    await limited.save(_record('first'));
    await expectLater(
      limited.save(_record('second')),
      throwsStateError,
    );
    expect((await limited.readAll()).single.id, 'first');
  });

  test('reports corrupted stored data instead of silently replacing it',
      () async {
    preferences.values[PreferencesAdminLocalDataSource.defaultStorageKey] =
        '{"schemaVersion":1,"records":[{"id":"duplicate",'
        '"createdAt":"2026-01-01T00:00:00.000Z"},'
        '{"id":"duplicate","createdAt":"2026-01-02T00:00:00.000Z"}]}';

    await expectLater(
      dataSource.readAll(),
      throwsFormatException,
    );
    expect(
      preferences.values[PreferencesAdminLocalDataSource.defaultStorageKey],
      contains('duplicate'),
    );
  });

  test('rejects stored data over the configured byte limit', () async {
    preferences.values[PreferencesAdminLocalDataSource.defaultStorageKey] =
        jsonEncode({
      'schemaVersion': 1,
      'records': [
        {'id': 'large', 'createdAt': '2026-01-01T00:00:00.000Z'},
      ],
    });
    final limited = PreferencesAdminLocalDataSource(
      preferences: preferences,
      maximumStorageBytes: 10,
    );

    await expectLater(
      limited.readAll(),
      throwsFormatException,
    );
  });
}

AdminRecord _record(
  String id, {
  DateTime? createdAt,
}) =>
    AdminRecord(
      id: id,
      createdAt: createdAt ?? DateTime.utc(2026),
    );

final class _MemoryPreferences implements PreferencesStorage {
  final values = <String, Object>{};

  @override
  Future<String?> readString(String key) async => values[key] as String?;

  @override
  Future<void> writeString(String key, String value) async {
    values[key] = value;
  }

  @override
  Future<bool?> readBool(String key) async => values[key] as bool?;

  @override
  Future<void> writeBool(String key, bool value) async {
    values[key] = value;
  }

  @override
  Future<void> delete(String key) async {
    values.remove(key);
  }
}
