import 'package:flutter/material.dart';

final class ExploreFeaturePage extends StatelessWidget {
  const ExploreFeaturePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Explore')),
        body: const Center(
          child: Text('This feature scaffold is not enabled yet.'),
        ),
      );
}
