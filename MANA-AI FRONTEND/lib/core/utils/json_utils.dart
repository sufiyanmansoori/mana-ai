import 'dart:convert';

abstract final class JsonUtils {
  static Object? decode(String source) => jsonDecode(source);

  static Map<String, Object?> decodeObject(String source) {
    final value = jsonDecode(source);
    if (value is! Map<String, dynamic>) {
      throw const FormatException('Expected a JSON object.');
    }
    return value;
  }

  static String encode(Object? value) => jsonEncode(value);
}
