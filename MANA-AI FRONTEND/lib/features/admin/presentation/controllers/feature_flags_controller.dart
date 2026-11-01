import 'package:flutter/foundation.dart';

import '../../data/datasources/feature_flags_api_data_source.dart';
import '../../application/feature_service.dart';
import '../../domain/entities/feature_flag.dart';

final class AdminFeatureFlagsController extends ChangeNotifier {
  AdminFeatureFlagsController(this._service);

  final AdminFeatureService _service;
  List<AdminFeatureFlag> _flags = const [];
  List<AdminFeatureFlagAuditEntry> _audit = const [];
  String? _error;
  String? _mutatingKey;
  bool _isLoading = false;
  bool _disposed = false;

  List<AdminFeatureFlag> get flags => List.unmodifiable(_flags);

  List<AdminFeatureFlagAuditEntry> get audit => List.unmodifiable(_audit);

  String? get error => _error;

  String? get mutatingKey => _mutatingKey;

  bool get isLoading => _isLoading;

  bool get isMutating => _mutatingKey != null;

  Future<void> load() async {
    if (_disposed || _isLoading) return;
    _isLoading = true;
    _error = null;
    _notifyListeners();
    try {
      if (_service.isInitialized) {
        await _service.refresh();
      } else {
        await _service.initialize();
      }
      _flags = _service.flags;
      _audit = _service.audit;
    } catch (error) {
      _error = _displayError(error);
    } finally {
      _isLoading = false;
      _notifyListeners();
    }
  }

  Future<bool> create({
    required String key,
    required String description,
    required bool enabled,
  }) async {
    final normalizedKey = key.trim();
    final normalizedDescription = description.trim();
    if (!RegExp(r'^[a-z][a-z0-9_.-]{1,63}$').hasMatch(normalizedKey)) {
      _setError('Flag keys must be 2–64 lowercase letters, numbers, dots, '
          'underscores, or hyphens.');
      return false;
    }
    if (normalizedDescription.isEmpty || normalizedDescription.length > 500) {
      _setError('Enter a description between 1 and 500 characters.');
      return false;
    }
    if (_mutatingKey != null) return false;

    _beginMutation('__create__');
    try {
      final flag = await _service.create(
        key: normalizedKey,
        description: normalizedDescription,
        enabled: enabled,
      );
      _flags = [..._flags, flag]
        ..sort((left, right) => left.key.compareTo(right.key));
      await _refreshAudit();
      return true;
    } catch (error) {
      _error = _displayError(error);
      return false;
    } finally {
      _endMutation();
    }
  }

  Future<bool> setEnabled({
    required String key,
    required bool enabled,
  }) async {
    if (_mutatingKey != null) return false;
    _beginMutation(key);
    try {
      final updated = await _service.setEnabled(key: key, enabled: enabled);
      _replaceFlag(updated);
      await _refreshAudit();
      return true;
    } catch (error) {
      _error = _displayError(error);
      return false;
    } finally {
      _endMutation();
    }
  }

  Future<bool> delete(String key) async {
    if (_mutatingKey != null) return false;
    _beginMutation(key);
    try {
      await _service.delete(key);
      _flags = _flags.where((flag) => flag.key != key).toList(growable: false);
      await _refreshAudit();
      return true;
    } catch (error) {
      _error = _displayError(error);
      return false;
    } finally {
      _endMutation();
    }
  }

  void clearError() {
    if (_error == null) return;
    _error = null;
    _notifyListeners();
  }

  Future<void> _refreshAudit() async {
    _audit = await _service.refreshAudit();
  }

  void _replaceFlag(AdminFeatureFlag updated) {
    final index = _flags.indexWhere((flag) => flag.key == updated.key);
    if (index == -1) {
      _flags = [..._flags, updated]
        ..sort((left, right) => left.key.compareTo(right.key));
      return;
    }
    final next = List<AdminFeatureFlag>.of(_flags);
    next[index] = updated;
    _flags = next;
  }

  void _beginMutation(String key) {
    _error = null;
    _mutatingKey = key;
    _notifyListeners();
  }

  void _endMutation() {
    _mutatingKey = null;
    _notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    _notifyListeners();
  }

  String _displayError(Object error) {
    if (error is AdminFeatureFlagsApiException) return error.message;
    return 'The feature flag request failed. Please retry.';
  }

  void _notifyListeners() {
    if (!_disposed) notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
