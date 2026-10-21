import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/agents/domain/entities/record.dart';

abstract interface class AgentsRemoteDataSource {
  Future<PaginatedResult<AgentsRecord>> list(
    PageCursor cursor,
  );

  Future<AgentsRecord?> getById(String id);

  Future<void> save(AgentsRecord record);

  Future<void> delete(String id);
}
