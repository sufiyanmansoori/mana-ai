import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/authentication/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';
import 'package:mana_ai_app/features/authentication/domain/repositories/feature_repository.dart';

final class AuthenticationFeatureRepositoryImpl
    implements AuthenticationFeatureRepository {
  const AuthenticationFeatureRepositoryImpl(this._remote);

  final AuthenticationRemoteDataSource _remote;

  @override
  Future<PaginatedResult<AuthenticationRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<AuthenticationRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(AuthenticationRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
