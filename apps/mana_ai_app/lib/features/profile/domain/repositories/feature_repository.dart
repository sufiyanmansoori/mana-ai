import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/profile/domain/entities/record.dart';

abstract interface class ProfileFeatureRepository {
  Future<PaginatedResult<ProfileRecord>> list(
    PageCursor cursor,
  );

  Future<ProfileRecord?> getById(String id);

  Future<void> save(ProfileRecord record);

  Future<void> delete(String id);
}
