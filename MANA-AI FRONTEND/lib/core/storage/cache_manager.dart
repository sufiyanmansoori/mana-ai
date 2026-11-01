import 'dart:collection';

import '../constants/cache_constants.dart';
import 'cache_entry.dart';
import 'cache_policy.dart';

final class CacheManager<T> {
  CacheManager({
    CachePolicy policy = const CachePolicy(
      ttl: CacheConstants.defaultTtl,
      maximumEntries: CacheConstants.maximumEntries,
    ),
    DateTime Function()? clock,
  })  : _policy = policy,
        _clock = clock ?? DateTime.now {
    if (policy.maximumEntries < 1 || policy.ttl <= Duration.zero) {
      throw ArgumentError('Cache policy limits must be positive.');
    }
  }

  final CachePolicy _policy;
  final DateTime Function() _clock;
  final LinkedHashMap<String, CacheEntry<T>> _entries = LinkedHashMap();

  int get length => _entries.length;

  T? read(String key) {
    final entry = _entries.remove(key);
    if (entry == null) return null;
    if (!_policy.isFresh(entry.createdAt, _clock())) return null;
    _entries[key] = entry;
    return entry.value;
  }

  void write(String key, T value) {
    if (key.trim().isEmpty) throw ArgumentError.value(key, 'key');
    _entries.remove(key);
    _entries[key] = CacheEntry(value: value, createdAt: _clock());
    while (_entries.length > _policy.maximumEntries) {
      _entries.remove(_entries.keys.first);
    }
  }

  bool remove(String key) => _entries.remove(key) != null;

  void clear() => _entries.clear();

  void removeExpired() {
    final now = _clock();
    _entries.removeWhere(
      (_, entry) => !_policy.isFresh(entry.createdAt, now),
    );
  }
}
