import '../constants/app_constants.dart';

final class PageCursor {
  PageCursor({
    this.token,
    this.limit = AppConstants.defaultPageSize,
  }) {
    if (limit < 1 || limit > AppConstants.maximumPageSize) {
      throw RangeError.range(
        limit,
        1,
        AppConstants.maximumPageSize,
        'limit',
      );
    }
    if (token != null && token!.isEmpty) {
      throw ArgumentError.value(token, 'token', 'Must not be empty.');
    }
  }

  final String? token;
  final int limit;

  Map<String, String> toQueryParameters() => {
        'limit': '$limit',
        if (token != null) 'cursor': token!,
      };
}