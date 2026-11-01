import 'package:mana_ai_app/features/voice/domain/entities/record.dart';

enum VoiceViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class VoiceViewState {
  VoiceViewState({
    required this.phase,
    List<VoiceRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final VoiceViewPhase phase;
  final List<VoiceRecord> records;
  final Object? error;
}
