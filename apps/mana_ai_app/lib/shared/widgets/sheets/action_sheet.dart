import 'package:flutter/material.dart';

final class ActionSheetItem<T> {
  const ActionSheetItem({
    required this.value,
    required this.label,
    required this.icon,
    this.enabled = true,
  });

  final T value;
  final String label;
  final IconData icon;
  final bool enabled;
}

abstract final class ActionSheet {
  static Future<T?> show<T>({
    required BuildContext context,
    required List<ActionSheetItem<T>> items,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      showDragHandle: true,
      builder: (context) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: [
            for (final item in items)
              ListTile(
                enabled: item.enabled,
                leading: Icon(item.icon),
                title: Text(item.label),
                onTap: item.enabled
                    ? () => Navigator.of(context).pop(item.value)
                    : null,
              ),
          ],
        ),
      ),
    );
  }
}
