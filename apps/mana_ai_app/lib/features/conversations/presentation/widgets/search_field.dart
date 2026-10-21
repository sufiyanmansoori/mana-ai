import 'package:flutter/material.dart';

final class ConversationsSearchField extends StatelessWidget {
  const ConversationsSearchField({required this.onChanged, super.key});

  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => TextField(
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        decoration: const InputDecoration(
          prefixIcon: Icon(Icons.search),
          hintText: 'Search conversations',
          border: OutlineInputBorder(),
        ),
      );
}
