import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/core/error/app_exception.dart';
import 'package:mana_ai_app/core/foundation/app_failure.dart';
import 'package:mana_ai_app/core/network/request_cancellation.dart';
import 'package:mana_ai_app/features/chat/data/datasources/chat_local_datasource.dart';
import 'package:mana_ai_app/features/chat/data/datasources/chat_remote_datasource.dart';
import 'package:mana_ai_app/features/chat/data/repositories/chat_repository_impl.dart';
import 'package:mana_ai_app/features/chat/domain/entities/chat_message.dart';
import 'package:mana_ai_app/features/chat/domain/entities/stream_chunk_entity.dart';
import 'package:mana_ai_app/features/chat/domain/repositories/chat_conversation_repository.dart';
import 'package:mana_ai_app/features/chat/domain/usecases/send_message_usecase.dart';
import 'package:mana_ai_app/features/chat/presentation/controllers/chat_session_controller.dart';

void main() {
  test('streams deltas while persisting the complete exchange', () async {
    final local = _MemoryChatDataSource();
    final repository = _repository(local);
    final controller = _controller(repository);
    final observedAssistantContent = <String>[];
    controller.addListener(() {
      final assistantMessages = controller.messages
          .where((message) => message.role == ChatMessageRole.assistant);
      if (assistantMessages.isNotEmpty) {
        observedAssistantContent.add(assistantMessages.last.content);
      }
    });
    await controller.initialize();

    expect(
      await controller.sendMessage(content: '  Hello  ', model: 'mana-small'),
      isTrue,
    );
    expect(
      controller.messages.map((message) => message.content),
      ['Hello', 'Good morning'],
    );
    expect(
      observedAssistantContent,
      ['Good ', 'Good morning', 'Good morning'],
    );
    expect(
      local.messages.map((message) => message.content),
      ['Hello', 'Good morning'],
    );
    expect(controller.isGenerating, isFalse);
    controller.dispose();
  });

  test('keeps the user message and displays a service failure', () async {
    final local = _MemoryChatDataSource();
    final repository = _repository(
      local,
      remote: _FakeRemote(
        (messages, cancellation) async* {
          throw const AppException(
            AppFailure(
              kind: FailureKind.unavailable,
              code: 'offline',
              message: 'The chat service could not complete this request.',
              isRetryable: true,
            ),
          );
        },
      ),
    );
    final controller = _controller(repository);
    await controller.initialize();

    expect(
      await controller.sendMessage(content: 'Keep this', model: 'mana-small'),
      isFalse,
    );
    expect(controller.failure?.kind, FailureKind.unavailable);
    expect(controller.messages.single.content, 'Keep this');
    expect(local.messages.single.content, 'Keep this');
    expect(controller.isGenerating, isFalse);
    controller.dispose();
  });

  test('rejects invalid content without persisting an empty user turn',
      () async {
    final repository = _repository(_MemoryChatDataSource());
    final controller = _controller(repository);
    await controller.initialize();

    expect(
      await controller.sendMessage(content: ' \u0000 ', model: 'mana-small'),
      isFalse,
    );
    expect(controller.failure?.kind, FailureKind.validation);
    expect(controller.messages, isEmpty);
    controller.dispose();
  });
}

ChatConversationRepository _repository(
  _MemoryChatDataSource local, {
  _FakeRemote? remote,
}) {
  return ChatConversationRepositoryImpl(
    localDataSource: local,
    remoteDataSource: remote ??
        _FakeRemote(
          (messages, cancellation) async* {
            yield const StreamChunkEntity(content: 'Good ');
            yield const StreamChunkEntity(content: 'morning');
            yield const StreamChunkEntity(isComplete: true);
          },
        ),
    clock: () => DateTime.utc(2026, 1, 1),
  );
}

ChatSessionController _controller(ChatConversationRepository repository) =>
    ChatSessionController(
      repository: repository,
      sendMessage: SendMessageUseCase(repository),
    );

final class _MemoryChatDataSource implements ChatLocalDataSource {
  List<ChatMessage> messages = [];

  @override
  Future<void> clearMessages(String conversationId) async {
    messages = [];
  }

  @override
  Future<List<ChatMessage>> loadMessages(String conversationId) async =>
      List.unmodifiable(messages);

  @override
  Future<void> saveMessages(
    String conversationId,
    List<ChatMessage> messages,
  ) async {
    this.messages = List.of(messages);
  }
}

final class _FakeRemote implements ChatRemoteDataSource {
  const _FakeRemote(this._stream);

  final Stream<StreamChunkEntity> Function(
    List<ChatMessage> messages,
    RequestCancellation cancellation,
  ) _stream;

  @override
  Stream<StreamChunkEntity> streamCompletion({
    required String model,
    required List<ChatMessage> messages,
    required RequestCancellation cancellation,
  }) =>
      _stream(messages, cancellation);
}
