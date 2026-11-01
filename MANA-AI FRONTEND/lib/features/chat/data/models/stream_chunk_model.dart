import 'dart:convert';

import '../../domain/entities/stream_chunk_entity.dart';

final class StreamChunkModel {
  const StreamChunkModel({
    this.content = '',
    this.isComplete = false,
  });

  factory StreamChunkModel.fromEventData(String data) {
    if (data.trim() == '[DONE]') {
      return const StreamChunkModel(isComplete: true);
    }

    final decoded = jsonDecode(data);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('The chat stream event is invalid.');
    }
    if (decoded['error'] != null) {
      throw const FormatException('The chat service returned an error.');
    }

    final choices = decoded['choices'];
    if (choices is! List || choices.isEmpty) {
      return const StreamChunkModel();
    }

    final firstChoice = choices.first;
    if (firstChoice is! Map<String, dynamic>) {
      throw const FormatException('The chat stream choice is invalid.');
    }
    final delta = firstChoice['delta'];
    if (delta is! Map<String, dynamic>) {
      throw const FormatException('The chat stream delta is invalid.');
    }

    final content = delta['content'];
    if (content != null && content is! String) {
      throw const FormatException('The chat stream content is invalid.');
    }
    return StreamChunkModel(
      content: content as String? ?? '',
      isComplete: firstChoice['finish_reason'] != null,
    );
  }

  final String content;
  final bool isComplete;

  StreamChunkEntity toEntity() => StreamChunkEntity(
        content: content,
        isComplete: isComplete,
      );
}
