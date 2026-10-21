import 'package:flutter/material.dart';

import 'app_route.dart';
import 'auth_guard.dart';

final class AppRouter {
  AppRouter({
    required Iterable<AppRoute> routes,
    required AuthGuard authGuard,
    required WidgetBuilder notFoundBuilder,
  })  : _routes = _indexRoutes(routes),
        _authGuard = authGuard,
        _notFoundBuilder = notFoundBuilder;

  final Map<String, AppRoute> _routes;
  final AuthGuard _authGuard;
  final WidgetBuilder _notFoundBuilder;

  Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    final name = settings.name;
    final route = name == null ? null : _routes[name];
    if (route == null) return _notFoundRoute(settings);

    if (!_authGuard.canActivate(
      requiresAuthentication: route.requiresAuthentication,
    )) {
      final signInRoute = _routes[_authGuard.signInRoute];
      if (signInRoute == null) {
        throw StateError(
          'Protected route "$name" requires an unregistered sign-in route '
          '"${_authGuard.signInRoute}".',
        );
      }
      return _materialRoute(signInRoute, settings);
    }

    return _materialRoute(route, settings);
  }

  MaterialPageRoute<void> _materialRoute(
    AppRoute route,
    RouteSettings settings,
  ) {
    return MaterialPageRoute<void>(
      settings: RouteSettings(name: route.name, arguments: settings.arguments),
      builder: route.builder,
    );
  }

  MaterialPageRoute<void> _notFoundRoute(RouteSettings settings) {
    return MaterialPageRoute<void>(
      settings: settings,
      builder: _notFoundBuilder,
    );
  }

  static Map<String, AppRoute> _indexRoutes(Iterable<AppRoute> routes) {
    final indexed = <String, AppRoute>{};
    for (final route in routes) {
      route.validate();
      if (indexed.containsKey(route.name)) {
        throw ArgumentError.value(route.name, 'routes', 'Duplicate route.');
      }
      indexed[route.name] = route;
    }
    if (indexed.isEmpty) {
      throw ArgumentError('At least one route must be registered.');
    }
    return Map.unmodifiable(indexed);
  }
}