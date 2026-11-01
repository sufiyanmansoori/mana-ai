import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';

enum AuthenticationViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class AuthenticationViewState {
  AuthenticationViewState({
    required this.phase,
    List<AuthenticationRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final AuthenticationViewPhase phase;
  final List<AuthenticationRecord> records;
  final Object? error;
}
