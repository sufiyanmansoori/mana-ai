import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/models/domain/entities/record.dart';
import 'package:mana_ai_app/features/models/domain/repositories/feature_repository.dart';

final class ModelsListRecords {
  const ModelsListRecords(this._repository);

  final ModelsFeatureRepository _repository;

  Future<PaginatedResult<ModelsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
