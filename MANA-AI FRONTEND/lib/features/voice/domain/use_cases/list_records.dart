import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/voice/domain/entities/record.dart';
import 'package:mana_ai_app/features/voice/domain/repositories/feature_repository.dart';

final class VoiceListRecords {
  const VoiceListRecords(this._repository);

  final VoiceFeatureRepository _repository;

  Future<PaginatedResult<VoiceRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
