import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/chat/domain/entities/record.dart';
import 'package:mana_ai_app/features/chat/domain/repositories/feature_repository.dart';

final class ChatListRecords {
  const ChatListRecords(this._repository);

  final ChatFeatureRepository _repository;

  Future<PaginatedResult<ChatRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
