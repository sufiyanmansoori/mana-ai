final class StreamBuffer {
  StreamBuffer({this.maximumCharacters = 256 * 1024}) {
    if (maximumCharacters < 1) {
      throw RangeError.value(maximumCharacters, 'maximumCharacters');
    }
  }

  final int maximumCharacters;
  final StringBuffer _buffer = StringBuffer();
  int _length = 0;

  int get length => _length;

  void append(String chunk) {
    if (chunk.isEmpty) return;
    if (_length + chunk.length > maximumCharacters) {
      throw StateError('Stream buffer reached its configured size limit.');
    }
    _buffer.write(chunk);
    _length += chunk.length;
  }

  String take() {
    final value = _buffer.toString();
    clear();
    return value;
  }

  void clear() {
    _buffer.clear();
    _length = 0;
  }
}
