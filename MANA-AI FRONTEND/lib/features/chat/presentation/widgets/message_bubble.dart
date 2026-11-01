import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import '../../domain/entities/chat_message.dart';

class MessageBubble extends StatelessWidget {
  const MessageBubble({required this.message, super.key});

  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == ChatMessageRole.user;
    final theme = Theme.of(context);
    final colorScheme = Theme.of(context).colorScheme;
    final backgroundColor =
        isUser ? colorScheme.primaryContainer : colorScheme.surface;
    final foregroundColor =
        isUser ? colorScheme.onPrimaryContainer : colorScheme.onSurface;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Column(
            crossAxisAlignment:
                isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: isUser ? backgroundColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: isUser
                    ? SelectableText(
                        message.content,
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: foregroundColor,
                        ),
                      )
                    : MarkdownBody(
                        data: message.content,
                        selectable: true,
                        softLineBreak: true,
                        styleSheet:
                            MarkdownStyleSheet.fromTheme(theme).copyWith(
                          p: theme.textTheme.bodyLarge?.copyWith(
                            color: foregroundColor,
                          ),
                        ),
                      ),
              ),
              if (!isUser && message.content.isNotEmpty)
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: IconButton(
                    tooltip: 'Copy response',
                    visualDensity: VisualDensity.compact,
                    onPressed: () => _copyResponse(context),
                    icon: const Icon(Icons.content_copy_outlined, size: 18),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _copyResponse(BuildContext context) async {
    await Clipboard.setData(ClipboardData(text: message.content));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Copied to clipboard')),
    );
  }
}
