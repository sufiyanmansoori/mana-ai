import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/chat/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/chat/domain/entities/record.dart';
import 'package:mana_ai_app/features/chat/domain/repositories/feature_repository.dart';

final class ChatFeatureRepositoryImpl implements ChatFeatureRepository {
  const ChatFeatureRepositoryImpl(this._remote);

  final ChatRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ChatRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ChatRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ChatRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
