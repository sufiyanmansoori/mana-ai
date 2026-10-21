import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';
import 'package:mana_ai_app/features/subscription/domain/repositories/feature_repository.dart';

final class SubscriptionListRecords {
  const SubscriptionListRecords(this._repository);

  final SubscriptionFeatureRepository _repository;

  Future<PaginatedResult<SubscriptionRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
