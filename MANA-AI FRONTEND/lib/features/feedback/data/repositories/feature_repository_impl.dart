import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/feedback/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';
import 'package:mana_ai_app/features/feedback/domain/repositories/feature_repository.dart';

final class FeedbackFeatureRepositoryImpl implements FeedbackFeatureRepository {
  const FeedbackFeatureRepositoryImpl(this._remote);

  final FeedbackRemoteDataSource _remote;

  @override
  Future<PaginatedResult<FeedbackRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<FeedbackRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(FeedbackRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
