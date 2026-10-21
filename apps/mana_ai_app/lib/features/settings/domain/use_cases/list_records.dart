import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/settings/domain/entities/record.dart';
import 'package:mana_ai_app/features/settings/domain/repositories/feature_repository.dart';

final class SettingsListRecords {
  const SettingsListRecords(this._repository);

  final SettingsFeatureRepository _repository;

  Future<PaginatedResult<SettingsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
