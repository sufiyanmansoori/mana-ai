import 'package:flutter/material.dart';

import '../../../../core/l10n/generated/app_localizations.dart';
import '../../domain/entities/chat_message.dart';
import '../controllers/chat_session_controller.dart';
import '../widgets/message_bubble.dart';
import '../widgets/message_composer.dart';

final class ChatScreen extends StatefulWidget {
  const ChatScreen({
    required this.controller,
    required this.model,
    super.key,
  });

  final ChatSessionController controller;
  final String model;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  @override
  void initState() {
    super.initState();
    widget.controller.initialize();
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(localizations.appTitle)),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListenableBuilder(
                listenable: widget.controller,
                builder: (context, _) {
                  final controller = widget.controller;
                  final failure = controller.failure;
                  return Column(
                    children: [
                      if (failure != null)
                        MaterialBanner(
                          content: Text(failure.message),
                          actions: [
                            TextButton(
                              onPressed: controller.clearFailure,
                              child: Text(localizations.dismiss),
                            ),
                          ],
                        ),
                      Expanded(
                        child: controller.isLoading
                            ? const Center(child: CircularProgressIndicator())
                            : controller.messages.isEmpty
                                ? Center(
                                    child: Text(
                                      localizations.chatEmpty,
                                      textAlign: TextAlign.center,
                                    ),
                                  )
                                : _MessageList(
                                    messages: controller.messages,
                                  ),
                      ),
                    ],
                  );
                },
              ),
            ),
            ListenableBuilder(
              listenable: widget.controller,
              builder: (context, _) => MessageComposer(
                onSendAsync: (content) => widget.controller.sendMessage(
                  content: content,
                  model: widget.model,
                ),
                isGenerating: widget.controller.isGenerating,
                onStop: widget.controller.stopGeneration,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

final class _MessageList extends StatelessWidget {
  const _MessageList({required this.messages});

  final List<ChatMessage> messages;

  @override
  Widget build(BuildContext context) => Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 840),
          child: ListView.builder(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
            itemCount: messages.length,
            itemBuilder: (context, index) => MessageBubble(
              message: messages[index],
            ),
          ),
        ),
      );
}
