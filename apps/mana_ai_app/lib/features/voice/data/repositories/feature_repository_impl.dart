import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/voice/data/datasources/remote_data_source.dart';
import 'package:mana_ai_app/features/voice/domain/entities/record.dart';
import 'package:mana_ai_app/features/voice/domain/repositories/feature_repository.dart';

final class VoiceFeatureRepositoryImpl implements VoiceFeatureRepository {
  const VoiceFeatureRepositoryImpl(this._remote);

  final VoiceRemoteDataSource _remote;

  @override
  Future<PaginatedResult<VoiceRecord>> list(
    PageCursor cursor,
  ) =>
      _remote.list(cursor);

  @override
  Future<VoiceRecord?> getById(String id) => _remote.getById(id);

  @override
  Future<void> save(VoiceRecord record) => _remote.save(record);

  @override
  Future<void> delete(String id) => _remote.delete(id);
}
