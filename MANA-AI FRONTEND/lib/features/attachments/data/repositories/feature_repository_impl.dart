import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/attachments/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';
import 'package:mana_ai_app/features/attachments/domain/repositories/feature_repository.dart';

final class AttachmentsFeatureRepositoryImpl
    implements AttachmentsFeatureRepository {
  const AttachmentsFeatureRepositoryImpl(this._remote);

  final AttachmentsRemoteDataSource _remote;

  @override
  Future<PaginatedResult<AttachmentsRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<AttachmentsRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(AttachmentsRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
