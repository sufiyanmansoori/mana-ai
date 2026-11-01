import '../../core/foundation/page_cursor.dart';
import '../../core/foundation/paginated_result.dart';

final class PaginationModel<T> {
  PaginationModel({
    required Iterable<T> items,
    this.nextCursor,
  }) : items = List<T>.unmodifiable(items);

  final List<T> items;
  final PageCursor? nextCursor;

  bool get hasMore => nextCursor != null;

  PaginatedResult<T> toDomain() =>
      PaginatedResult<T>(items: items, nextCursor: nextCursor);
}
