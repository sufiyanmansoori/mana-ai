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
    this.models = const [],
    super.key,
  });

  final ChatSessionController controller;
  final String model;
  final List<String> models;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late String _selectedModel;

  @override
  void initState() {
    super.initState();
    _selectedModel = widget.model;
    widget.controller.initialize();
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.appTitle),
        actions: [
          if (widget.models.isNotEmpty)
            Padding(
              padding: const EdgeInsetsDirectional.only(end: 12),
              child: Tooltip(
                message: 'Select AI model',
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedModel,
                    items: [
                      for (final model in widget.models)
                        DropdownMenuItem(
                          value: model,
                          child: Text(model),
                        ),
                    ],
                    onChanged: widget.models.length < 2
                        ? null
                        : (model) {
                            if (model == null) return;
                            setState(() => _selectedModel = model);
                          },
                  ),
                ),
              ),
            ),
        ],
      ),
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
                  model: _selectedModel,
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
