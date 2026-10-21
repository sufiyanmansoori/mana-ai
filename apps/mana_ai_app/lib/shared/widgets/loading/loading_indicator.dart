import 'package:flutter/material.dart';

final class LoadingIndicator extends StatelessWidget {
  const LoadingIndicator({
    this.label = 'Loading',
    this.compact = false,
    super.key,
  });

  final String label;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      liveRegion: true,
      label: label,
      child: compact
          ? const SizedBox.square(
              dimension: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 12),
                  Text(label),
                ],
              ),
            ),
    );
  }
}
