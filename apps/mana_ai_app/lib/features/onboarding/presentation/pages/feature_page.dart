import 'package:flutter/material.dart';

final class OnboardingFeaturePage extends StatelessWidget {
  const OnboardingFeaturePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Onboarding')),
        body: const Center(
          child: Text('This feature scaffold is not enabled yet.'),
        ),
      );
}
