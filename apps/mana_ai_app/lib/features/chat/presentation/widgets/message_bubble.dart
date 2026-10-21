import 'package:flutter/material.dart';

import '../../domain/entities/chat_message.dart';

class MessageBubble extends StatelessWidget {
  const MessageBubble({required this.message, super.key});

  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == ChatMessageRole.user;
    final colorScheme = Theme.of(context).colorScheme;
    final backgroundColor =
        isUser ? colorScheme.primaryContainer : colorScheme.surface;
    final foregroundColor =
        isUser ? colorScheme.onPrimaryContainer : colorScheme.onSurface;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(20),
          ),
          child: SelectableText(
            message.content,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: foregroundColor,
                ),
          ),
        ),
      ),
    );
  }
}
