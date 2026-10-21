import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/explore/domain/entities/record.dart';
import 'package:mana_ai_app/features/explore/domain/repositories/feature_repository.dart';

final class ExploreListRecords {
  const ExploreListRecords(this._repository);

  final ExploreFeatureRepository _repository;

  Future<PaginatedResult<ExploreRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
