import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';

abstract interface class AttachmentsRemoteDataSource {
  Future<PaginatedResult<AttachmentsRecord>> list(
    PageCursor cursor,
  );

  Future<AttachmentsRecord?> getById(String id);

  Future<void> save(AttachmentsRecord record);

  Future<void> delete(String id);
}
