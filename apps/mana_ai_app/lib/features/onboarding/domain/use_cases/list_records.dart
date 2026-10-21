import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';
import 'package:mana_ai_app/features/onboarding/domain/repositories/feature_repository.dart';

final class OnboardingListRecords {
  const OnboardingListRecords(this._repository);

  final OnboardingFeatureRepository _repository;

  Future<PaginatedResult<OnboardingRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
