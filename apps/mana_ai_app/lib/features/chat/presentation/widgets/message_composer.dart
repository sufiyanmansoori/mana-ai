import 'package:flutter/material.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/l10n/generated/app_localizations.dart';

class MessageComposer extends StatefulWidget {
  const MessageComposer({
    this.onSend,
    this.onSendAsync,
    this.isGenerating = false,
    this.onStop,
    this.onAttach,
    this.onThink,
    this.onVoice,
    this.attachments = const [],
    this.onRemoveAttachment,
    super.key,
  }) : assert((onSend == null) != (onSendAsync == null));

  final bool Function(String content)? onSend;
  final Future<bool> Function(String content)? onSendAsync;
  final bool isGenerating;
  final VoidCallback? onStop;
  final VoidCallback? onAttach;
  final VoidCallback? onThink;
  final VoidCallback? onVoice;
  final List<String> attachments;
  final ValueChanged<String>? onRemoveAttachment;

  @override
  State<MessageComposer> createState() => _MessageComposerState();
}

class _MessageComposerState extends State<MessageComposer> {
  final _textController = TextEditingController();
  bool _isSending = false;

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final content = _textController.text.trim();
    if (content.isEmpty || _isSending || widget.isGenerating) return;

    setState(() => _isSending = true);
    try {
      final sent = widget.onSendAsync != null
          ? await widget.onSendAsync!(content)
          : widget.onSend!(content);
      if (sent && mounted && _textController.text.trim() == content) {
        _textController.clear();
      }
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final colorScheme = Theme.of(context).colorScheme;
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 840),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.attachments.isNotEmpty)
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 8, left: 8),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final attachment in widget.attachments)
                          InputChip(
                            avatar: const Icon(
                              Icons.attach_file,
                              size: 16,
                            ),
                            label: ConstrainedBox(
                              constraints: const BoxConstraints(maxWidth: 180),
                              child: Text(
                                attachment,
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                            ),
                            onDeleted: widget.onRemoveAttachment == null
                                ? null
                                : () => widget.onRemoveAttachment!(attachment),
                          ),
                      ],
                    ),
                  ),
                ),
              Container(
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: colorScheme.outlineVariant),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8, 8, 8, 4),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextField(
                        controller: _textController,
                        readOnly: _isSending || widget.isGenerating,
                        minLines: 1,
                        maxLines: 6,
                        maxLength: AppConstants.maximumChatMessageLength,
                        textInputAction: TextInputAction.send,
                        onSubmitted: (_) => _send(),
                        decoration: const InputDecoration(
                          hintText: 'Ask Mana AI',
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          filled: false,
                          counterText: '',
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            tooltip: 'Attach a file',
                            onPressed: _isSending || widget.isGenerating
                                ? null
                                : widget.onAttach,
                            icon: const Icon(Icons.add),
                          ),
                          const Spacer(),
                          TextButton.icon(
                            onPressed: widget.onThink,
                            icon:
                                const Icon(Icons.psychology_outlined, size: 19),
                            label: const Text('Think'),
                          ),
                          IconButton(
                            tooltip: 'Voice input',
                            onPressed: widget.onVoice,
                            icon: const Icon(Icons.mic_none_outlined),
                          ),
                          const SizedBox(width: 4),
                          IconButton.filled(
                            tooltip: widget.isGenerating
                                ? localizations.stopGeneration
                                : localizations.sendMessage,
                            onPressed:
                                widget.isGenerating ? widget.onStop : _send,
                            icon: Icon(
                              widget.isGenerating
                                  ? Icons.stop
                                  : Icons.arrow_upward,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 5, right: 12),
                child: Align(
                  alignment: AlignmentDirectional.centerEnd,
                  child: ValueListenableBuilder<TextEditingValue>(
                    valueListenable: _textController,
                    builder: (context, value, _) => Text(
                      '${value.text.length}/${AppConstants.maximumChatMessageLength}',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
