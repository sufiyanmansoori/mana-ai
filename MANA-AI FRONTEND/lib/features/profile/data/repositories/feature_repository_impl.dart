import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/profile/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/profile/domain/entities/record.dart';
import 'package:mana_ai_app/features/profile/domain/repositories/feature_repository.dart';

final class ProfileFeatureRepositoryImpl implements ProfileFeatureRepository {
  const ProfileFeatureRepositoryImpl(this._remote);

  final ProfileRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ProfileRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ProfileRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ProfileRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
