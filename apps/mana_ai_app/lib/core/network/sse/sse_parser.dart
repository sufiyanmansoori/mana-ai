import 'sse_event.dart';

final class SseParser {
  String _buffer = '';
  final List<String> _data = [];
  String? _eventType;
  String? _lastEventId;
  Duration? _retry;
  bool _hasData = false;

  List<SseEvent> addChunk(String chunk) {
    _buffer += chunk;
    final events = <SseEvent>[];

    while (_buffer.isNotEmpty) {
      final lf = _buffer.indexOf('\n');
      final cr = _buffer.indexOf('\r');
      final separator = _firstSeparator(lf, cr);
      if (separator == -1) break;
      if (_buffer[separator] == '\r' &&
          separator == _buffer.length - 1) {
        break;
      }

      final line = _buffer.substring(0, separator);
      final separatorLength =
          _buffer[separator] == '\r' &&
                  separator + 1 < _buffer.length &&
                  _buffer[separator + 1] == '\n'
              ? 2
              : 1;
      _buffer = _buffer.substring(separator + separatorLength);
      _processLine(line, events);
    }

    return events;
  }

  List<SseEvent> close() {
    final events = <SseEvent>[];
    if (_buffer.isNotEmpty) {
      final line = _buffer.endsWith('\r')
          ? _buffer.substring(0, _buffer.length - 1)
          : _buffer;
      _processLine(line, events);
      _buffer = '';
    }
    _dispatch(events);
    return events;
  }

  int _firstSeparator(int lf, int cr) {
    if (lf == -1) return cr;
    if (cr == -1) return lf;
    return lf < cr ? lf : cr;
  }

  void _processLine(String line, List<SseEvent> events) {
    if (line.isEmpty) {
      _dispatch(events);
      return;
    }
    if (line.startsWith(':')) return;

    final colon = line.indexOf(':');
    final field = colon == -1 ? line : line.substring(0, colon);
    var value = colon == -1 ? '' : line.substring(colon + 1);
    if (value.startsWith(' ')) value = value.substring(1);

    switch (field) {
      case 'data':
        _hasData = true;
        _data.add(value);
        break;
      case 'event':
        _eventType = value;
        break;
      case 'id':
        if (!value.contains('\u0000')) _lastEventId = value;
        break;
      case 'retry':
        final milliseconds = int.tryParse(value);
        if (milliseconds != null && milliseconds >= 0) {
          _retry = Duration(milliseconds: milliseconds);
        }
        break;
    }
  }

  void _dispatch(List<SseEvent> events) {
    if (_hasData) {
      events.add(
        SseEvent(
          data: _data.join('\n'),
          event: _eventType?.isNotEmpty == true ? _eventType! : 'message',
          id: _lastEventId,
          retry: _retry,
        ),
      );
    }
    _data.clear();
    _eventType = null;
    _hasData = false;
  }
}