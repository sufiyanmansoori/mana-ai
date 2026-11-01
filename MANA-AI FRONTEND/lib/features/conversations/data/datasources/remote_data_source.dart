import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';

abstract interface class ConversationsRemoteDataSource {
  Future<PaginatedResult<ConversationsRecord>> list(
    PageCursor cursor,
  );

  Future<ConversationsRecord?> getById(String id);

  Future<void> save(ConversationsRecord record);

  Future<void> delete(String id);
}
