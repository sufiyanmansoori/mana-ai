import 'package:flutter/widgets.dart';

import '../../../core/constants/layout_constants.dart';

final class AdaptiveLayout extends StatelessWidget {
  const AdaptiveLayout({
    required this.compact,
    required this.expanded,
    this.medium,
    super.key,
  });

  final WidgetBuilder compact;
  final WidgetBuilder? medium;
  final WidgetBuilder expanded;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= LayoutConstants.desktopBreakpoint) {
          return expanded(context);
        }
        if (constraints.maxWidth >= LayoutConstants.tabletBreakpoint) {
          return (medium ?? expanded)(context);
        }
        return compact(context);
      },
    );
  }
}
