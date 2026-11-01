import '../../domain/entities/feature_flag.dart';
import '../../domain/repositories/feature_flag_repository.dart';
import '../datasources/feature_flags_api_data_source.dart';

final class AdminFeatureFlagRepositoryImpl
    implements AdminFeatureFlagRepository {
  const AdminFeatureFlagRepositoryImpl(this._dataSource);

  final AdminFeatureFlagsDataSource _dataSource;

  @override
  Future<List<AdminFeatureFlag>> list() async =>
      List.unmodifiable(await _dataSource.list());

  @override
  Future<List<AdminFeatureFlagAuditEntry>> listAudit() async =>
      List.unmodifiable(await _dataSource.listAudit());

  @override
  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  }) =>
      _dataSource.create(
        key: key,
        description: description,
        enabled: enabled,
      );

  @override
  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  }) =>
      _dataSource.setEnabled(key: key, enabled: enabled);

  @override
  Future<void> delete(String key) => _dataSource.delete(key);
}
