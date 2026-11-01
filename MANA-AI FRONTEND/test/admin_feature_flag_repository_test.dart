import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/features/admin/data/datasources/feature_flags_api_data_source.dart';
import 'package:mana_ai_app/features/admin/data/repositories/feature_flag_repository_impl.dart';
import 'package:mana_ai_app/features/admin/domain/entities/feature_flag.dart';

void main() {
  late _FakeFeatureFlagsDataSource dataSource;
  late AdminFeatureFlagRepositoryImpl repository;

  setUp(() {
    dataSource = _FakeFeatureFlagsDataSource();
    repository = AdminFeatureFlagRepositoryImpl(dataSource);
  });

  test('returns immutable snapshots of feature flags and audit entries',
      () async {
    dataSource.flags.add(_flag('chat_updates'));
    dataSource.audit.add(_auditEntry('audit-1', 'chat_updates'));

    final flags = await repository.list();
    final audit = await repository.listAudit();

    expect(flags.single.key, 'chat_updates');
    expect(audit.single.id, 'audit-1');
    expect(() => flags.clear(), throwsUnsupportedError);
    expect(() => audit.clear(), throwsUnsupportedError);

    dataSource.flags.add(_flag('image_updates'));
    dataSource.audit.add(_auditEntry('audit-2', 'image_updates'));

    expect(flags, hasLength(1));
    expect(audit, hasLength(1));
  });

  test('forwards create arguments and returns the created flag', () async {
    final created = await repository.create(
      key: 'chat_updates',
      description: 'Enable chat improvements.',
      enabled: true,
    );

    expect(dataSource.createCall, {
      'key': 'chat_updates',
      'description': 'Enable chat improvements.',
      'enabled': true,
    });
    expect(created.key, 'chat_updates');
  });

  test('forwards enabled changes and returns the updated flag', () async {
    final updated = await repository.setEnabled(
      key: 'chat_updates',
      enabled: true,
    );

    expect(dataSource.setEnabledCall, {
      'key': 'chat_updates',
      'enabled': true,
    });
    expect(updated.enabled, isTrue);
  });

  test('forwards deletion to the data source', () async {
    await repository.delete('chat_updates');

    expect(dataSource.deletedKey, 'chat_updates');
  });

  test('propagates data source errors without hiding the failure', () async {
    final failure = StateError('Data source unavailable.');
    dataSource.failure = failure;

    await expectLater(repository.list(), throwsA(same(failure)));
    await expectLater(repository.listAudit(), throwsA(same(failure)));
    await expectLater(
      repository.create(
        key: 'chat_updates',
        description: 'Enable chat improvements.',
        enabled: false,
      ),
      throwsA(same(failure)),
    );
    await expectLater(
      repository.setEnabled(key: 'chat_updates', enabled: true),
      throwsA(same(failure)),
    );
    await expectLater(
      repository.delete('chat_updates'),
      throwsA(same(failure)),
    );
  });
}

AdminFeatureFlag _flag(
  String key, {
  bool enabled = false,
}) =>
    AdminFeatureFlag(
      key: key,
      description: 'Feature flag $key.',
      enabled: enabled,
      createdAt: DateTime.utc(2026),
      updatedAt: DateTime.utc(2026),
      updatedBy: 'admin-user',
    );

AdminFeatureFlagAuditEntry _auditEntry(String id, String key) =>
    AdminFeatureFlagAuditEntry(
      id: id,
      key: key,
      action: 'created',
      actorSubject: 'admin-user',
      occurredAt: DateTime.utc(2026),
    );

final class _FakeFeatureFlagsDataSource implements AdminFeatureFlagsDataSource {
  final flags = <AdminFeatureFlag>[];
  final audit = <AdminFeatureFlagAuditEntry>[];
  Map<String, Object?>? createCall;
  Map<String, Object?>? setEnabledCall;
  String? deletedKey;
  Object? failure;

  @override
  Future<List<AdminFeatureFlag>> list() async {
    _throwIfFailed();
    return flags;
  }

  @override
  Future<List<AdminFeatureFlagAuditEntry>> listAudit() async {
    _throwIfFailed();
    return audit;
  }

  @override
  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  }) async {
    _throwIfFailed();
    createCall = {
      'key': key,
      'description': description,
      'enabled': enabled,
    };
    return _flag(key, enabled: enabled);
  }

  @override
  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  }) async {
    _throwIfFailed();
    setEnabledCall = {'key': key, 'enabled': enabled};
    return _flag(key, enabled: enabled);
  }

  @override
  Future<void> delete(String key) async {
    _throwIfFailed();
    deletedKey = key;
  }

  void _throwIfFailed() {
    final currentFailure = failure;
    if (currentFailure != null) throw currentFailure;
  }
}
