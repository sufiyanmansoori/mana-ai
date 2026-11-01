abstract interface class TransactionalStore {
  Future<T> transaction<T>(Future<T> Function() action);
}