import '../entities/feature_flag.dart';

abstract interface class AdminFeatureFlagRepository {
  Future<List<AdminFeatureFlag>> list();

  Future<List<AdminFeatureFlagAuditEntry>> listAudit();

  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  });

  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  });

  Future<void> delete(String key);
}
