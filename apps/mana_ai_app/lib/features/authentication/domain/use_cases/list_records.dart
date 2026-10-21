import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';
import 'package:mana_ai_app/features/authentication/domain/repositories/feature_repository.dart';

final class AuthenticationListRecords {
  const AuthenticationListRecords(this._repository);

  final AuthenticationFeatureRepository _repository;

  Future<PaginatedResult<AuthenticationRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
