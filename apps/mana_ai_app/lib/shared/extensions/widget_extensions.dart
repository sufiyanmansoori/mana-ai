import 'package:flutter/widgets.dart';

extension ManaWidgetExtensions on Widget {
  Widget centered() => Center(child: this);

  Widget padded(EdgeInsetsGeometry padding) =>
      Padding(padding: padding, child: this);
}
