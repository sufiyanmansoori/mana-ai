import '../../core/utils/url_utils.dart';

abstract final class UrlValidator {
  static String? validate(String value) {
    try {
      UrlUtils.parseHttpUrl(value);
      return null;
    } on FormatException {
      return 'Enter a valid HTTP or HTTPS URL.';
    }
  }
}
