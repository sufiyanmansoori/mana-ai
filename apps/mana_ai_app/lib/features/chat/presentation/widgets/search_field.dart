import 'package:flutter/material.dart';

final class ChatSearchField extends StatelessWidget {
  const ChatSearchField({required this.onChanged, super.key});

  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => TextField(
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        decoration: const InputDecoration(
          prefixIcon: Icon(Icons.search),
          hintText: 'Search chat',
          border: OutlineInputBorder(),
        ),
      );
}
