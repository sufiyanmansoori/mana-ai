import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/admin/domain/entities/record.dart';
import 'package:mana_ai_app/features/admin/domain/repositories/feature_repository.dart';

final class AdminListRecords {
  const AdminListRecords(this._repository);

  final AdminFeatureRepository _repository;

  Future<PaginatedResult<AdminRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
