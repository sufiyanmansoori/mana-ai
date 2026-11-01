import '../domain/entities/feature_flag.dart';
import '../domain/repositories/feature_flag_repository.dart';

abstract interface class AdminFeatureService {
  bool get isInitialized;

  List<AdminFeatureFlag> get flags;

  List<AdminFeatureFlagAuditEntry> get audit;

  Future<void> initialize();

  Future<void> refresh();

  Future<List<AdminFeatureFlagAuditEntry>> refreshAudit();

  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  });

  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  });

  Future<void> delete(String key);
}

final class RepositoryAdminFeatureService implements AdminFeatureService {
  RepositoryAdminFeatureService(this._repository);

  static final _keyPattern = RegExp(r'^[a-z][a-z0-9_.-]{1,63}$');
  static const _maximumDescriptionLength = 500;

  final AdminFeatureFlagRepository _repository;

  List<AdminFeatureFlag> _flags = const [];
  List<AdminFeatureFlagAuditEntry> _audit = const [];
  Future<void>? _initialization;
  Future<void>? _refreshInProgress;
  bool _initialized = false;
  bool _mutationInProgress = false;

  @override
  bool get isInitialized => _initialized;

  @override
  List<AdminFeatureFlag> get flags => List.unmodifiable(_flags);

  @override
  List<AdminFeatureFlagAuditEntry> get audit => List.unmodifiable(_audit);

  @override
  Future<void> initialize() {
    if (_initialized) return _refreshInProgress ?? Future<void>.value();
    return _initialization ??= _initialize();
  }

  @override
  Future<void> refresh() {
    _ensureNoMutation();
    if (_initialization != null) return _initialization!;
    return _refreshInProgress ??= _refreshSnapshot();
  }

  @override
  Future<List<AdminFeatureFlagAuditEntry>> refreshAudit() async {
    await initialize();
    _ensureNoMutation();
    final entries = await _repository.listAudit();
    _audit = List.unmodifiable(entries);
    return audit;
  }

  @override
  Future<AdminFeatureFlag> create({
    required String key,
    required String description,
    required bool enabled,
  }) async {
    final normalizedKey = key.trim();
    final normalizedDescription = description.trim();
    _validateKey(normalizedKey);
    _validateDescription(normalizedDescription);

    await initialize();
    _ensureNoMutation();
    if (_flags.any((flag) => flag.key == normalizedKey)) {
      throw ArgumentError.value(
        normalizedKey,
        'key',
        'The flag already exists.',
      );
    }

    return _mutate(() async {
      final created = await _repository.create(
        key: normalizedKey,
        description: normalizedDescription,
        enabled: enabled,
      );
      if (created.key != normalizedKey) {
        throw StateError('The repository returned a different feature flag.');
      }
      final next = <AdminFeatureFlag>[..._flags, created]..sort(_compareFlags);
      _flags = List.unmodifiable(next);
      return created;
    });
  }

  @override
  Future<AdminFeatureFlag> setEnabled({
    required String key,
    required bool enabled,
  }) async {
    final normalizedKey = key.trim();
    _validateKey(normalizedKey);

    await initialize();
    _ensureNoMutation();
    if (!_flags.any((flag) => flag.key == normalizedKey)) {
      throw ArgumentError.value(
        normalizedKey,
        'key',
        'The flag does not exist.',
      );
    }

    return _mutate(() async {
      final updated = await _repository.setEnabled(
        key: normalizedKey,
        enabled: enabled,
      );
      if (updated.key != normalizedKey) {
        throw StateError('The repository returned a different feature flag.');
      }
      final next = List<AdminFeatureFlag>.of(_flags);
      final index = next.indexWhere((flag) => flag.key == normalizedKey);
      next[index] = updated;
      _flags = List.unmodifiable(next);
      return updated;
    });
  }

  @override
  Future<void> delete(String key) async {
    final normalizedKey = key.trim();
    _validateKey(normalizedKey);

    await initialize();
    _ensureNoMutation();
    if (!_flags.any((flag) => flag.key == normalizedKey)) {
      throw ArgumentError.value(
        normalizedKey,
        'key',
        'The flag does not exist.',
      );
    }

    await _mutate(() async {
      await _repository.delete(normalizedKey);
      _flags = List.unmodifiable(
        _flags.where((flag) => flag.key != normalizedKey),
      );
    });
  }

  Future<void> _loadSnapshot() async {
    final results = await Future.wait<Object>([
      _repository.list(),
      _repository.listAudit(),
    ]);
    final flags = results[0];
    final audit = results[1];
    if (flags is! List<AdminFeatureFlag> ||
        audit is! List<AdminFeatureFlagAuditEntry>) {
      throw StateError('The admin repository returned invalid data.');
    }

    final uniqueKeys = flags.map((flag) => flag.key).toSet();
    if (uniqueKeys.length != flags.length) {
      throw StateError(
        'The admin repository returned duplicate feature flags.',
      );
    }

    _flags = List.unmodifiable(
      List<AdminFeatureFlag>.of(flags)..sort(_compareFlags),
    );
    _audit = List.unmodifiable(audit);
    _initialized = true;
    _initialization = null;
  }

  Future<void> _refreshSnapshot() async {
    try {
      await _loadSnapshot();
    } finally {
      _refreshInProgress = null;
    }
  }

  Future<void> _initialize() async {
    try {
      await _loadSnapshot();
    } catch (_) {
      _initialization = null;
      rethrow;
    }
  }

  Future<T> _mutate<T>(Future<T> Function() operation) async {
    _mutationInProgress = true;
    try {
      return await operation();
    } finally {
      _mutationInProgress = false;
    }
  }

  void _ensureNoMutation() {
    if (_mutationInProgress) {
      throw StateError('Another feature flag change is already in progress.');
    }
  }

  void _validateKey(String key) {
    if (!_keyPattern.hasMatch(key)) {
      throw ArgumentError.value(
        key,
        'key',
        'Flag keys must be 2–64 lowercase letters, numbers, dots, '
            'underscores, or hyphens.',
      );
    }
  }

  void _validateDescription(String description) {
    if (description.isEmpty || description.length > _maximumDescriptionLength) {
      throw ArgumentError.value(
        description,
        'description',
        'Enter a description between 1 and $_maximumDescriptionLength '
            'characters.',
      );
    }
  }

  int _compareFlags(AdminFeatureFlag left, AdminFeatureFlag right) =>
      left.key.compareTo(right.key);
}
