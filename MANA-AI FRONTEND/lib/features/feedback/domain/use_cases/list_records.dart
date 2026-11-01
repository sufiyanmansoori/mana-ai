import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';
import 'package:mana_ai_app/features/feedback/domain/repositories/feature_repository.dart';

final class FeedbackListRecords {
  const FeedbackListRecords(this._repository);

  final FeedbackFeatureRepository _repository;

  Future<PaginatedResult<FeedbackRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
