import 'package:flutter/foundation.dart';

import 'migrations/schema_migration.dart';

abstract interface class LocalDatabase {
  Future<void> open();

  Future<T> transaction<T>(Future<T> Function() action);

  Future<void> migrate(Iterable<SchemaMigration> migrations);

  Future<void> close();
}

final class LocalDatabaseLifecycle extends ChangeNotifier {
  bool _isOpen = false;

  bool get isOpen => _isOpen;

  void markOpen() {
    if (_isOpen) return;
    _isOpen = true;
    notifyListeners();
  }

  void markClosed() {
    if (!_isOpen) return;
    _isOpen = false;
    notifyListeners();
  }
}
