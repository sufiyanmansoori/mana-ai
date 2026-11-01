import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/support/domain/entities/record.dart';
import 'package:mana_ai_app/features/support/domain/repositories/feature_repository.dart';

final class SupportListRecords {
  const SupportListRecords(this._repository);

  final SupportFeatureRepository _repository;

  Future<PaginatedResult<SupportRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
