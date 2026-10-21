import '../foundation/app_failure.dart';

final class AppException implements Exception {
  const AppException(this.failure, {this.cause});

  final AppFailure failure;
  final Object? cause;

  @override
  String toString() => 'AppException(${failure.kind}: ${failure.message})';
}