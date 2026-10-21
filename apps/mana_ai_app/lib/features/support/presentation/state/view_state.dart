import 'package:mana_ai_app/features/support/domain/entities/record.dart';

enum SupportViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class SupportViewState {
  SupportViewState({
    required this.phase,
    List<SupportRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final SupportViewPhase phase;
  final List<SupportRecord> records;
  final Object? error;
}
