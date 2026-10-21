import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/memory/domain/entities/record.dart';
import 'package:mana_ai_app/features/memory/domain/repositories/feature_repository.dart';

final class MemoryListRecords {
  const MemoryListRecords(this._repository);

  final MemoryFeatureRepository _repository;

  Future<PaginatedResult<MemoryRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
