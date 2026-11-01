import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/features/admin/data/mappers/record_mapper.dart';
import 'package:mana_ai_app/features/admin/data/models/record_model.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

void main() {
  group('AdminRecordMapper', () {
    test('maps a model to its domain entity without changing values', () {
      final createdAt = DateTime.utc(2026, 10, 25, 12, 30);
      final model = AdminRecordModel(
        id: 'record-1',
        createdAt: createdAt,
      );

      final record = AdminRecordMapper.fromModel(model);

      expect(record.id, model.id);
      expect(record.createdAt, createdAt);
    });

    test('maps a domain entity to its persistence model', () {
      final record = AdminRecord(
        id: 'record-2',
        createdAt: DateTime.utc(2026, 10, 25),
      );

      final model = AdminRecordMapper.toModel(record);

      expect(model.id, record.id);
      expect(model.createdAt, record.createdAt);
    });

    test('normalizes IDs and timestamps to the canonical representation', () {
      final localTimestamp = DateTime.parse('2026-10-25T12:30:00+05:30');
      final model = AdminRecordModel(
        id: '  record-3  ',
        createdAt: localTimestamp,
      );

      final record = AdminRecordMapper.fromModel(model);
      final persisted = AdminRecordMapper.toModel(record);

      expect(record.id, 'record-3');
      expect(record.createdAt.isUtc, isTrue);
      expect(record.createdAt, localTimestamp.toUtc());
      expect(persisted.createdAt.isUtc, isTrue);
    });

    test('rejects malformed model and entity IDs with useful errors', () {
      expect(
        () => AdminRecordMapper.fromModel(
          AdminRecordModel(
            id: '  ',
            createdAt: DateTime.utc(2026),
          ),
        ),
        throwsFormatException,
      );
      expect(
        () => AdminRecordMapper.toModel(
          AdminRecord(
            id: 'bad\nid',
            createdAt: DateTime.utc(2026),
          ),
        ),
        throwsArgumentError,
      );
    });

    test('maps collections in order and returns immutable results', () {
      final records = [
        AdminRecord(
          id: 'second',
          createdAt: DateTime.utc(2026, 2),
        ),
        AdminRecord(
          id: 'first',
          createdAt: DateTime.utc(2026, 1),
        ),
      ];

      final models = AdminRecordMapper.toModels(records);
      final entities = AdminRecordMapper.fromModels(models);

      expect(models.map((model) => model.id), ['second', 'first']);
      expect(entities.map((record) => record.id), ['second', 'first']);
      expect(
        () => models.add(
          AdminRecordModel(
            id: 'third',
            createdAt: DateTime.utc(2026, 3),
          ),
        ),
        throwsUnsupportedError,
      );
      expect(
        () => entities.clear(),
        throwsUnsupportedError,
      );
    });

    test('maps empty collections to immutable empty results', () {
      expect(AdminRecordMapper.fromModels(const []), isEmpty);
      expect(AdminRecordMapper.toModels(const []), isEmpty);
      expect(
        () => AdminRecordMapper.fromModels(const []).clear(),
        throwsUnsupportedError,
      );
    });

    test('includes the element position when a collection has invalid data',
        () {
      expect(
        () => AdminRecordMapper.fromModels([
          AdminRecordModel(
            id: 'valid',
            createdAt: DateTime.utc(2026),
          ),
          AdminRecordModel(
            id: '',
            createdAt: DateTime.utc(2026),
          ),
        ]),
        throwsA(
          isA<FormatException>().having(
            (error) => error.message,
            'message',
            contains('index 1'),
          ),
        ),
      );
    });
  });
}
