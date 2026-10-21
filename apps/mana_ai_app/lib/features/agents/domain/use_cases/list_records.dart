import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/agents/domain/entities/record.dart';
import 'package:mana_ai_app/features/agents/domain/repositories/feature_repository.dart';

final class AgentsListRecords {
  const AgentsListRecords(this._repository);

  final AgentsFeatureRepository _repository;

  Future<PaginatedResult<AgentsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
