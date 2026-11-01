import 'package:mana_ai_app/features/profile/domain/entities/record.dart';

enum ProfileViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ProfileViewState {
  ProfileViewState({
    required this.phase,
    List<ProfileRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ProfileViewPhase phase;
  final List<ProfileRecord> records;
  final Object? error;
}
