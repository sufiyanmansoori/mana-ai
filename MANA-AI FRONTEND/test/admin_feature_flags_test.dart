import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mana_ai_app/app.dart';
import 'package:mana_ai_app/core/config/app_config.dart';
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';
import 'package:mana_ai_app/features/admin/application/feature_service.dart';
import 'package:mana_ai_app/features/admin/domain/entities/feature_flag.dart';
import 'package:mana_ai_app/features/admin/domain/repositories/feature_flag_repository.dart';
import 'package:mana_ai_app/features/admin/presentation/controllers/feature_flags_controller.dart';
import 'package:mana_ai_app/features/admin/data/datasources/feature_flags_api_data_source.dart';
import 'package:mana_ai_app/features/chat/data/repositories/local_chat_repository.dart';
import 'package:mana_ai_app/features/chat/presentation/chat_controller.dart';

void main() {
  test('controller validates keys and applies audited flag mutations',
      () async {
    final repository = _FakeFeatureFlagRepository();
    final controller = AdminFeatureFlagsController(
      RepositoryAdminFeatureService(repository),
    );
    addTearDown(controller.dispose);

    await controller.load();
    expect(controller.flags, isEmpty);
    expect(
      await controller.create(
        key: 'Invalid Key',
        description: 'Not accepted',
        enabled: false,
      ),
      isFalse,
    );
    expect(repository.createCalls, 0);
    expect(controller.error, contains('lowercase'));

    expect(
      await controller.create(
        key: 'new_chat_ui',
        description: 'Enable the redesigned chat experience.',
        enabled: false,
      ),
      isTrue,
    );
    expect(controller.flags.single.key, 'new_chat_ui');

    expect(
      await controller.setEnabled(key: 'new_chat_ui', enabled: true),
      isTrue,
    );
    expect(controller.flags.single.enabled, isTrue);

    expect(await controller.delete('new_chat_ui'), isTrue);
    expect(controller.flags, isEmpty);
    expect(
      repository.audit.map((entry) => entry.action),
      ['deleted', 'updated', 'created'],
    );
  });

  testWidgets('admin feature flags are reachable from the chat sidebar',
      (tester) async {
    final controller = AdminFeatureFlagsController(
      RepositoryAdminFeatureService(_FakeFeatureFlagRepository()),
    );
    await tester.pumpWidget(
      ManaAiApp(
        config: AppConfig(
          environment: AppEnvironment.development,
          apiBaseUri: null,
        ),
        chatController: ChatController(LocalChatRepository()),
        adminFeatureFlagsController: controller,
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView).first, const Offset(0, -700));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Feature flags'));
    await tester.pumpAndSettle();

    expect(find.text('Control staged features safely'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  test('application service initializes immutable, sorted feature state',
      () async {
    final repository = _FakeFeatureFlagRepository()
      ..flags['z_last'] = _featureFlag('z_last')
      ..flags['a_first'] = _featureFlag('a_first');
    final service = RepositoryAdminFeatureService(repository);

    await service.initialize();

    expect(service.isInitialized, isTrue);
    expect(service.flags.map((flag) => flag.key), ['a_first', 'z_last']);
    expect(
      () => service.flags.clear(),
      throwsUnsupportedError,
    );
    await expectLater(
      service.create(
        key: 'Invalid Key',
        description: 'This should be rejected.',
        enabled: false,
      ),
      throwsArgumentError,
    );
    expect(repository.createCalls, 0);
  });

  test('application service coalesces initialization and can retry failures',
      () async {
    final repository = _FakeFeatureFlagRepository()..failNextList = true;
    final service = RepositoryAdminFeatureService(repository);

    await expectLater(service.initialize(), throwsStateError);
    expect(service.isInitialized, isFalse);

    await Future.wait([service.initialize(), service.initialize()]);

    expect(service.isInitialized, isTrue);
    expect(repository.listCalls, 2);
    expect(repository.auditCalls, 2);
  });

  test('API datasource sends the stored bearer token', () async {
    final client = MockClient((request) async {
      expect(
        request.headers['authorization'],
        'Bearer admin-access-token',
      );
      return http.Response(
        jsonEncode({
          'data': [
            {
              'key': 'new_chat_ui',
              'description': 'Enable the redesigned chat experience.',
              'enabled': true,
              'created_at': '2026-01-01T00:00:00Z',
              'updated_at': '2026-01-01T00:00:00Z',
              'updated_by': 'admin-user',
            },
          ],
        }),
        200,
      );
    });
    final dataSource = AdminFeatureFlagsApiDataSource(
      endpoint: ApiEndpoint('https://api.example.test'),
      client: client,
      secureStorage: _FakeSecureStorage(),
    );

    final flags = await dataSource.list();

    expect(flags.single.key, 'new_chat_ui');
    client.close();
  });
}

AdminFeatureFlag _featureFlag(String key) => AdminFeatureFlag(
      key: key,
      description: 'Feature flag $key.',
      enabled: false,
      createdAt: DateTime.utc(2026),
      updatedAt: DateTime.utc(2026),
      updatedBy: 'admin-user',
    );

class _FakeFeatureFlagRepository implements AdminFeatureFlagRepository {
  final flags = <String, AdminFeatureFlag>{};
  final audit = <AdminFeatureFlagAuditEntry>[];
  var createCalls = 0;
  var listCalls = 0;
  var auditCalls = 0;
  var failNextList = false;
  var _nextAuditId = 0;

  @override
  Future<List<AdminFeatureFlag>> list() async {
    listCalls++;
    if (failNextList) {
      failNextList = false;
      throw StateError('Temporary repository failure.');
    }
    return flags.values.toList();
  }

  @override
  Future<List<AdminFeatureFlagAuditEntry>> listAudit() async {
    auditCalls++;
    return List.unmodifiable(audit);
  }

  @override
  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  }) async {
    createCalls++;
    final now = DateTime.utc(2026);
    final flag = AdminFeatureFlag(
      key: key,
      description: description,
      enabled: enabled,
      createdAt: now,
      updatedAt: now,
      updatedBy: 'admin-user',
    );
    flags[key] = flag;
    _record(key, 'created');
    return flag;
  }

  @override
  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  }) async {
    final existing = flags[key]!;
    final updated = AdminFeatureFlag(
      key: existing.key,
      description: existing.description,
      enabled: enabled,
      createdAt: existing.createdAt,
      updatedAt: DateTime.utc(2026),
      updatedBy: 'admin-user',
    );
    flags[key] = updated;
    _record(key, 'updated');
    return updated;
  }

  @override
  Future<void> delete(String key) async {
    flags.remove(key);
    _record(key, 'deleted');
  }

  void _record(String key, String action) {
    audit.insert(
      0,
      AdminFeatureFlagAuditEntry(
        id: '${_nextAuditId++}',
        key: key,
        action: action,
        actorSubject: 'admin-user',
        occurredAt: DateTime.utc(2026),
      ),
    );
  }
}

class _FakeSecureStorage implements SecureKeyValueStore {
  @override
  String? readAccessTokenSync() => 'admin-access-token';

  @override
  Future<String?> read(String key) async => null;

  @override
  Future<void> write(String key, String value) async {}

  @override
  Future<void> delete(String key) async {}

  @override
  Future<void> deleteAll() async {}
}
