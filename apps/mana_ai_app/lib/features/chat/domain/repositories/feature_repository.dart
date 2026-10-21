import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/chat/domain/entities/record.dart';

abstract interface class ChatFeatureRepository {
  Future<PaginatedResult<ChatRecord>> list(
    PageCursor cursor,
  );

  Future<ChatRecord?> getById(String id);

  Future<void> save(ChatRecord record);

  Future<void> delete(String id);
}
