import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/settings/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/settings/domain/entities/record.dart';
import 'package:mana_ai_app/features/settings/domain/repositories/feature_repository.dart';

final class SettingsFeatureRepositoryImpl implements SettingsFeatureRepository {
  const SettingsFeatureRepositoryImpl(this._remote);

  final SettingsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<SettingsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<SettingsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(SettingsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
