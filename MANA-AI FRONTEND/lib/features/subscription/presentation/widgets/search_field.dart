import 'package:flutter/material.dart';

final class SubscriptionSearchField extends StatelessWidget {
  const SubscriptionSearchField({required this.onChanged, super.key});

  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => TextField(
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        decoration: const InputDecoration(
          prefixIcon: Icon(Icons.search),
          hintText: 'Search subscription',
          border: OutlineInputBorder(),
        ),
      );
}
