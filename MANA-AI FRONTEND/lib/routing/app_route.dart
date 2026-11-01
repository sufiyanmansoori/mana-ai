import 'package:flutter/widgets.dart';

final class AppRoute {
  const AppRoute({
    required this.name,
    required this.builder,
    this.requiresAuthentication = false,
  });

  final String name;
  final WidgetBuilder builder;
  final bool requiresAuthentication;

  void validate() {
    if (!name.startsWith('/') || name == '/') {
      throw ArgumentError.value(name, 'name', 'Routes must be absolute paths.');
    }
  }
}