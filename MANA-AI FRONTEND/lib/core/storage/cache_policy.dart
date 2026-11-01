final class CachePolicy {
  const CachePolicy({
    required this.ttl,
    this.maximumEntries = 500,
    this.maximumValueBytes = 256 * 1024,
  });

  final Duration ttl;
  final int maximumEntries;
  final int maximumValueBytes;

  bool isFresh(DateTime createdAt, DateTime now) =>
      !now.isBefore(createdAt) && now.difference(createdAt) < ttl;
}
