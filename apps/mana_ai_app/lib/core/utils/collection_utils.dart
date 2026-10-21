abstract final class CollectionUtils {
  static List<T> immutableCopy<T>(Iterable<T> values) =>
      List<T>.unmodifiable(values);

  static Map<K, V> immutableMap<K, V>(Map<K, V> values) =>
      Map<K, V>.unmodifiable(values);

  static List<List<T>> chunks<T>(Iterable<T> values, int size) {
    if (size < 1) throw RangeError.value(size, 'size');
    final result = <List<T>>[];
    var current = <T>[];
    for (final value in values) {
      current.add(value);
      if (current.length == size) {
        result.add(List.unmodifiable(current));
        current = <T>[];
      }
    }
    if (current.isNotEmpty) result.add(List.unmodifiable(current));
    return List.unmodifiable(result);
  }
}
