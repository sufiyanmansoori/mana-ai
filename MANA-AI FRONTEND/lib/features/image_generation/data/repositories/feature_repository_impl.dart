import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/image_generation/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';
import 'package:mana_ai_app/features/image_generation/domain/repositories/feature_repository.dart';

final class ImageGenerationFeatureRepositoryImpl
    implements ImageGenerationFeatureRepository {
  const ImageGenerationFeatureRepositoryImpl(this._remote);

  final ImageGenerationRemoteDataSource _remote;

  @override
  Future<PaginatedResult<ImageGenerationRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<ImageGenerationRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(ImageGenerationRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
