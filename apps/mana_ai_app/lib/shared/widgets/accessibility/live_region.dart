import 'package:flutter/widgets.dart';

final class LiveRegion extends StatelessWidget {
  const LiveRegion({
    required this.label,
    required this.child,
    this.polite = true,
    super.key,
  });

  final String label;
  final Widget child;
  final bool polite;

  @override
  Widget build(BuildContext context) => Semantics(
        container: true,
        liveRegion: polite,
        label: label,
        child: child,
      );
}
