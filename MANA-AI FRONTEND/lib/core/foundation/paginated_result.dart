import 'page_cursor.dart';

final class PaginatedResult<T> {
  PaginatedResult({
    required List<T> items,
    this.nextCursor,
  }) : items = List<T>.unmodifiable(items);

  final List<T> items;
  final PageCursor? nextCursor;

  bool get hasMore => nextCursor != null;
}