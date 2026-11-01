import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';
import 'package:mana_ai_app/features/canvas/domain/repositories/feature_repository.dart';

final class CanvasListRecords {
  const CanvasListRecords(this._repository);

  final CanvasFeatureRepository _repository;

  Future<PaginatedResult<CanvasRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
