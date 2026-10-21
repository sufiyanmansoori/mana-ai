import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MemoryDetailPanel extends StatelessWidget {
  const MemoryDetailPanel({required this.onDelete, super.key});

  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mutedStyle = theme.textTheme.bodySmall?.copyWith(
      color: theme.colorScheme.onSurfaceVariant,
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 920),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      'Mana AI',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  OutlinedButton(
                    onPressed: onDelete,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: theme.colorScheme.onSurface,
                      backgroundColor: theme.colorScheme.surfaceContainerHigh,
                      side: BorderSide.none,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                    ),
                    child: const Text('Delete'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text('Last updated', style: mutedStyle),
              const SizedBox(height: 4),
              Text(
                DateFormat('MMM d, y').format(DateTime.now()),
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 22),
              Text('Summary', style: mutedStyle),
              const SizedBox(height: 6),
              Text(
                'A sample entry showing how saved memories appear in the '
                'Mana AI workspace.',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 22),
              Text('Details', style: mutedStyle),
              const SizedBox(height: 8),
              const _MemoryBullet(
                text: 'This is example content for the memory detail screen.',
              ),
              const _MemoryBullet(
                text: 'Memory data stays local in this preview build.',
              ),
              const _MemoryBullet(
                text: 'Connect a backend to save and sync personal memories.',
              ),
              const SizedBox(height: 18),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: theme.colorScheme.outlineVariant),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 9,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.info_outline,
                        size: 16,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 8),
                      Text('Sample memory · Local preview', style: mutedStyle),
                    ],
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

class _MemoryBullet extends StatelessWidget {
  const _MemoryBullet({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 7),
            child: Icon(
              Icons.circle,
              size: 5,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              text,
              style: theme.textTheme.bodyMedium?.copyWith(height: 1.5),
            ),
          ),
        ],
      ),
    );
  }
}
