import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/features/admin/data/models/record_model.dart';

void main() {
  group('AdminRecordModel', () {
    test('parses the API JSON contract and trims the record ID', () {
      final model = AdminRecordModel.fromJson({
        'id': ' record-1 ',
        'createdAt': '2026-10-25T12:30:00.123456+05:30',
      });

      expect(model.id, 'record-1');
      expect(
        model.createdAt,
        DateTime.utc(2026, 10, 25, 7, 0, 0, 123, 456),
      );
    });

    test('serializes using stable UTC ISO 8601 JSON', () {
      final model = AdminRecordModel(
        id: ' record-2 ',
        createdAt: DateTime.parse('2026-10-25T12:30:00+05:30'),
      );

      expect(model.toJson(), {
        'id': 'record-2',
        'createdAt': '2026-10-25T07:00:00.000Z',
      });
    });

    test('round trips records through JSON', () {
      final original = AdminRecordModel(
        id: 'record-3',
        createdAt: DateTime.utc(2026, 10, 25, 12, 30, 15, 123, 456),
      );

      final restored = AdminRecordModel.fromJson(original.toJson());

      expect(restored.id, original.id);
      expect(restored.createdAt, original.createdAt);
    });

    test('rejects missing fields and fields with the wrong JSON type', () {
      expect(
        () => AdminRecordModel.fromJson(const {}),
        throwsFormatException,
      );
      expect(
        () => AdminRecordModel.fromJson({
          'id': 42,
          'createdAt': '2026-10-25T00:00:00Z',
        }),
        throwsFormatException,
      );
      expect(
        () => AdminRecordModel.fromJson({
          'id': 'record-1',
          'createdAt': 1792886400,
        }),
        throwsFormatException,
      );
    });

    test('rejects blank, oversized, or control-character IDs', () {
      for (final id in [
        '',
        '  ',
        'record\ninjected',
        List.filled(AdminRecordModel.maximumIdLength + 1, 'x').join(),
      ]) {
        expect(
          () => AdminRecordModel.fromJson({
            'id': id,
            'createdAt': '2026-10-25T00:00:00Z',
          }),
          throwsFormatException,
          reason: 'ID should be rejected: $id',
        );
      }
    });

    test('rejects malformed and non-existent calendar timestamps', () {
      for (final timestamp in [
        '',
        '2026-10-25',
        '2026-10-25T00:00:00',
        '2026-02-30T00:00:00Z',
        '2026-10-25T24:00:00Z',
        '2026-10-25T00:00:60Z',
        '2026-10-25T00:00:00.1234567Z',
        '2026-10-25T00:00:00Z${List.filled(65, 'x').join()}',
      ]) {
        expect(
          () => AdminRecordModel.fromJson({
            'id': 'record-1',
            'createdAt': timestamp,
          }),
          throwsFormatException,
          reason: 'Timestamp should be rejected: $timestamp',
        );
      }
    });

    test('ignores additive JSON properties for forward compatibility', () {
      final model = AdminRecordModel.fromJson({
        'id': 'record-1',
        'createdAt': '2026-10-25T00:00:00Z',
        'futureProperty': true,
      });

      expect(model.toJson().keys, ['id', 'createdAt']);
    });
  });
}
