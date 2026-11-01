import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/voice/domain/entities/record.dart';

abstract interface class VoiceFeatureRepository {
  Future<PaginatedResult<VoiceRecord>> list(
    PageCursor cursor,
  );

  Future<VoiceRecord?> getById(String id);

  Future<void> save(VoiceRecord record);

  Future<void> delete(String id);
}
