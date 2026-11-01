import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

final class CodeBlock extends StatelessWidget {
  const CodeBlock({
    required this.code,
    this.language,
    super.key,
  });

  final String code;
  final String? language;

  Future<void> _copy(BuildContext context) async {
    await Clipboard.setData(ClipboardData(text: code));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Copied to clipboard')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(language ?? 'Code')),
              IconButton(
                tooltip: 'Copy code',
                onPressed: () => _copy(context),
                icon: const Icon(Icons.copy_outlined),
              ),
            ],
          ),
          SelectableText(
            code,
            style: const TextStyle(fontFamily: 'monospace'),
          ),
        ],
      ),
    );
  }
}
