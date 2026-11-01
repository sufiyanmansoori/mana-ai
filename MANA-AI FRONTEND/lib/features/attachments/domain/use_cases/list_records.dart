import 'package:mana_ai_app/core/foundation/page_cursor.dart';
import 'package:mana_ai_app/core/foundation/paginated_result.dart';
import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';
import 'package:mana_ai_app/features/attachments/domain/repositories/feature_repository.dart';

final class AttachmentsListRecords {
  const AttachmentsListRecords(this._repository);

  final AttachmentsFeatureRepository _repository;

  Future<PaginatedResult<AttachmentsRecord>> call(
    PageCursor cursor,
  ) =>
      _repository.list(cursor);
}
