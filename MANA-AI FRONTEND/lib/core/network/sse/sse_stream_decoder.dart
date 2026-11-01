import 'dart:convert';

import 'sse_event.dart';
import 'sse_parser.dart';

abstract final class SseStreamDecoder {
  static Stream<SseEvent> decode(Stream<List<int>> byteStream) async* {
    final parser = SseParser();
    await for (final chunk in byteStream.transform(utf8.decoder)) {
      yield* Stream<SseEvent>.fromIterable(parser.addChunk(chunk));
    }
    yield* Stream<SseEvent>.fromIterable(parser.close());
  }
}