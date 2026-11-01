import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';

abstract interface class SubscriptionFeatureRepository {
  Future<PaginatedResult<SubscriptionRecord>> list(
    PageCursor cursor,
  );

  Future<SubscriptionRecord?> getById(String id);

  Future<void> save(SubscriptionRecord record);

  Future<void> delete(String id);
}
