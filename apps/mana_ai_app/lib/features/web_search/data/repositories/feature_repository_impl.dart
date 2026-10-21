import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/web_search/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';
import 'package:mana_ai_app/features/web_search/domain/repositories/feature_repository.dart';

final class WebSearchFeatureRepositoryImpl
    implements WebSearchFeatureRepository {
  const WebSearchFeatureRepositoryImpl(this._remote);

  final WebSearchRemoteDataSource _remote;

  @override
  Future<PaginatedResult<WebSearchRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<WebSearchRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(WebSearchRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
