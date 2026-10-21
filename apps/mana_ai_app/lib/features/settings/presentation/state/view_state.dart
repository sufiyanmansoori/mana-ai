import 'package:mana_ai_app/features/settings/domain/entities/record.dart';

enum SettingsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class SettingsViewState {
  SettingsViewState({
    required this.phase,
    List<SettingsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final SettingsViewPhase phase;
  final List<SettingsRecord> records;
  final Object? error;
}
