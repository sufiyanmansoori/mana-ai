import 'package:flutter/material.dart';

final class HelpTooltip extends StatelessWidget {
  const HelpTooltip({
    required this.message,
    this.icon = Icons.info_outline,
    super.key,
  });

  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) => Tooltip(
        message: message,
        child: Icon(icon, size: 18, semanticLabel: message),
      );
}
