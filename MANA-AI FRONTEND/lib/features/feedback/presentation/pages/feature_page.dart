import 'package:flutter/material.dart';

final class FeedbackFeaturePage extends StatelessWidget {
  const FeedbackFeaturePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Feedback')),
        body: const Center(
          child: Text('This feature scaffold is not enabled yet.'),
        ),
      );
}
