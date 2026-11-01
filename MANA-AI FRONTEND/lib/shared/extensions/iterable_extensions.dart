extension ManaIterableExtensions<T> on Iterable<T> {
  T? get firstOrNull {
    final iterator = this.iterator;
    return iterator.moveNext() ? iterator.current : null;
  }

  List<T> immutableCopy() => List<T>.unmodifiable(this);
}
