import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';

abstract interface class ImageGenerationFeatureRepository {
  Future<PaginatedResult<ImageGenerationRecord>> list(
    PageCursor cursor,
  );

  Future<ImageGenerationRecord?> getById(String id);

  Future<void> save(ImageGenerationRecord record);

  Future<void> delete(String id);
}
