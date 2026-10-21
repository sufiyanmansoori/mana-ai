import '../constants/app_constants.dart';

final class PaginationParams {
  PaginationParams({this.cursor, this.limit = AppConstants.defaultPageSize}) {
    if (limit < 1 || limit > AppConstants.maximumPageSize) {
      throw RangeError.range(
        limit,
        1,
        AppConstants.maximumPageSize,
        'limit',
      );
    }
    if (cursor != null && cursor!.isEmpty) {
      throw ArgumentError.value(cursor, 'cursor', 'Must not be empty.');
    }
  }

  final String? cursor;
  final int limit;

  Map<String, String> toQueryParameters() => {
        'limit': '$limit',
        if (cursor != null) 'cursor': cursor!,
      };
}
