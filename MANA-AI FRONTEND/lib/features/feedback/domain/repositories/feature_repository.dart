import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';

abstract interface class FeedbackFeatureRepository {
  Future<PaginatedResult<FeedbackRecord>> list(
    PageCursor cursor,
  );

  Future<FeedbackRecord?> getById(String id);

  Future<void> save(FeedbackRecord record);

  Future<void> delete(String id);
}
