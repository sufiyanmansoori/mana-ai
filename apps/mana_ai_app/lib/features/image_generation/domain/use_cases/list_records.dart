import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';
import 'package:mana_ai_app/features/image_generation/domain/repositories/feature_repository.dart';

final class ImageGenerationListRecords {
  const ImageGenerationListRecords(this._repository);

  final ImageGenerationFeatureRepository _repository;

  Future<PaginatedResult<ImageGenerationRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
