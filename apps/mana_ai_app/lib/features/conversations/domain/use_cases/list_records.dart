import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';
import 'package:mana_ai_app/features/conversations/domain/repositories/feature_repository.dart';

final class ConversationsListRecords {
  const ConversationsListRecords(this._repository);

  final ConversationsFeatureRepository _repository;

  Future<PaginatedResult<ConversationsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
