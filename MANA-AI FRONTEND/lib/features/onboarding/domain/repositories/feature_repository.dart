import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';

abstract interface class OnboardingFeatureRepository {
  Future<PaginatedResult<OnboardingRecord>> list(
    PageCursor cursor,
  );

  Future<OnboardingRecord?> getById(String id);

  Future<void> save(OnboardingRecord record);

  Future<void> delete(String id);
}
