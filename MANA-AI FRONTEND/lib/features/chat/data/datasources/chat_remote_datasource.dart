import 'package:mana_ai_app/core/network/request_cancellation.dart';

import '../../domain/entities/chat_message.dart';
import '../../domain/entities/stream_chunk_entity.dart';

abstract interface class ChatRemoteDataSource {
  Stream<StreamChunkEntity> streamCompletion({
    required String model,
    required List<ChatMessage> messages,
    required RequestCancellation cancellation,
  });
}
