import 'package:flutter/material.dart';

final class SupportFeaturePage extends StatelessWidget {
  const SupportFeaturePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Support')),
        body: const Center(
          child: Text('This feature scaffold is not enabled yet.'),
        ),
      );
}
