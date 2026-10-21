import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';

abstract interface class AuthenticationFeatureRepository {
  Future<PaginatedResult<AuthenticationRecord>> list(
    PageCursor cursor,
  );

  Future<AuthenticationRecord?> getById(String id);

  Future<void> save(AuthenticationRecord record);

  Future<void> delete(String id);
}
