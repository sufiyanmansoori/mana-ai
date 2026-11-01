import 'package:flutter/material.dart';

final class MemorySearchField extends StatelessWidget {
  const MemorySearchField({required this.onChanged, super.key});

  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => TextField(
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        decoration: const InputDecoration(
          prefixIcon: Icon(Icons.search),
          hintText: 'Search memory',
          border: OutlineInputBorder(),
        ),
      );
}
