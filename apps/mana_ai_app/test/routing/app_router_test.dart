import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mana_ai_app/routing/app_route.dart';
import 'package:mana_ai_app/routing/app_router.dart';
import 'package:mana_ai_app/routing/auth_guard.dart';

void main() {
  Widget screen(String label) => Scaffold(body: Text(label));

  test('generates registered routes with their configured names', () {
    final router = AppRouter(
      routes: [
        AppRoute(name: '/chat', builder: (_) => screen('Chat')),
      ],
      authGuard: AuthGuard(isAuthenticated: () => false),
      notFoundBuilder: (_) => screen('Missing'),
    );

    final route = router.onGenerateRoute(
      const RouteSettings(name: '/chat'),
    );

    expect(route, isA<MaterialPageRoute<void>>());
    expect(route!.settings.name, '/chat');
  });

  test('redirects unauthenticated access to the registered sign-in route', () {
    final router = AppRouter(
      routes: [
        AppRoute(name: '/sign-in', builder: (_) => screen('Sign in')),
        AppRoute(
          name: '/account',
          builder: (_) => screen('Account'),
          requiresAuthentication: true,
        ),
      ],
      authGuard: AuthGuard(isAuthenticated: () => false),
      notFoundBuilder: (_) => screen('Missing'),
    );

    final route = router.onGenerateRoute(
      const RouteSettings(name: '/account'),
    );

    expect(route!.settings.name, '/sign-in');
  });

  test('uses the not-found builder for unregistered locations', () {
    final router = AppRouter(
      routes: [
        AppRoute(name: '/chat', builder: (_) => screen('Chat')),
      ],
      authGuard: AuthGuard(isAuthenticated: () => false),
      notFoundBuilder: (_) => screen('Missing'),
    );

    final route = router.onGenerateRoute(
      const RouteSettings(name: '/missing'),
    );

    expect(route!.settings.name, '/missing');
  });

  test('rejects duplicate routes during setup', () {
    final route = AppRoute(name: '/chat', builder: (_) => screen('Chat'));

    expect(
      () => AppRouter(
        routes: [route, route],
        authGuard: AuthGuard(isAuthenticated: () => false),
        notFoundBuilder: (_) => screen('Missing'),
      ),
      throwsArgumentError,
    );
  });
}
