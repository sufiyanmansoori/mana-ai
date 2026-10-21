import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/profile/domain/entities/record.dart';
import 'package:mana_ai_app/features/profile/domain/repositories/feature_repository.dart';

final class ProfileListRecords {
  const ProfileListRecords(this._repository);

  final ProfileFeatureRepository _repository;

  Future<PaginatedResult<ProfileRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
