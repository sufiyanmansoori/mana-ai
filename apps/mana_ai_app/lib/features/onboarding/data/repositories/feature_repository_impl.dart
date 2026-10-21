import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/onboarding/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/onboarding/domain/entities/record.dart';
import 'package:mana_ai_app/features/onboarding/domain/repositories/feature_repository.dart';

final class OnboardingFeatureRepositoryImpl
    implements OnboardingFeatureRepository {
  const OnboardingFeatureRepositoryImpl(this._remote);

  final OnboardingRemoteDataSource _remote;

  @override
  Future<PaginatedResult<OnboardingRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<OnboardingRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(OnboardingRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
