final class CacheEntry<T> {
  const CacheEntry({
    required this.value,
    required this.createdAt,
  });

  final T value;
  final DateTime createdAt;
}