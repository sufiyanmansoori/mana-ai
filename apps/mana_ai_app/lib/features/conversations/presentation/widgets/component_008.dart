import 'package:flutter/material.dart';

final class ConversationsComponent008Widget extends StatelessWidget {
  const ConversationsComponent008Widget({
    required this.title,
    required this.description,
    super.key,
  });

  final String title;
  final String description;

  @override
  Widget build(BuildContext context) => Semantics(
        container: true,
        label: title,
        child: Card(
          child: ListTile(
            title: Text(title),
            subtitle: Text(description),
            leading: const Icon(Icons.auto_awesome_outlined),
          ),
        ),
      );
}
