final class ServiceRegistry {
  final Map<Type, Object> _singletons = {};
  final Map<Type, Object Function()> _lazySingletons = {};
  final Map<Type, Object Function()> _factories = {};

  void registerSingleton<T extends Object>(T instance) {
    _ensureUnregistered<T>();
    _singletons[T] = instance;
  }

  void registerLazySingleton<T extends Object>(T Function() factory) {
    _ensureUnregistered<T>();
    _lazySingletons[T] = factory;
  }

  void registerFactory<T extends Object>(T Function() factory) {
    _ensureUnregistered<T>();
    _factories[T] = factory;
  }

  T get<T extends Object>() {
    final singleton = _singletons[T];
    if (singleton != null) return singleton as T;

    final lazyFactory = _lazySingletons[T];
    if (lazyFactory != null) {
      final instance = lazyFactory();
      _singletons[T] = instance;
      _lazySingletons.remove(T);
      return instance as T;
    }

    final factory = _factories[T];
    if (factory != null) return factory() as T;

    throw StateError('No service is registered for $T.');
  }

  bool isRegistered<T extends Object>() =>
      _singletons.containsKey(T) ||
      _lazySingletons.containsKey(T) ||
      _factories.containsKey(T);

  void reset() {
    _singletons.clear();
    _lazySingletons.clear();
    _factories.clear();
  }

  void _ensureUnregistered<T extends Object>() {
    if (isRegistered<T>()) {
      throw StateError('A service is already registered for $T.');
    }
  }
}