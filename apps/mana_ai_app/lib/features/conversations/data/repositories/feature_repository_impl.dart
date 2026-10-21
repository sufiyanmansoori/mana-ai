import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/conversations/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';
import 'package:mana_ai_app/features/conversations/domain/repositories/feature_repository.dart';

final class ConversationsFeatureRepositoryImpl
    implements ConversationsFeatureRepository {
  const ConversationsFeatureRepositoryImpl(this._remote);

  final ConversationsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ConversationsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ConversationsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ConversationsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
