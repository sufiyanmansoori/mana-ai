final class AuthGuard {
  const AuthGuard({
    required bool Function() isAuthenticated,
    this.signInRoute = '/sign-in',
  }) : _isAuthenticated = isAuthenticated;

  final bool Function() _isAuthenticated;
  final String signInRoute;

  bool canActivate({required bool requiresAuthentication}) =>
      !requiresAuthentication || _isAuthenticated();
}