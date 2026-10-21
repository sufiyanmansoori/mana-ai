import 'package:flutter/material.dart';

final class SettingsFeaturePage extends StatelessWidget {
  const SettingsFeaturePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Settings')),
        body: const Center(
          child: Text('This feature scaffold is not enabled yet.'),
        ),
      );
}
