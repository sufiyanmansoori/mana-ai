import 'package:mana_ai_app/features/admin/domain/entities/record.dart';

enum AdminViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class AdminViewState {
  AdminViewState({
    required this.phase,
    List<AdminRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final AdminViewPhase phase;
  final List<AdminRecord> records;
  final Object? error;
}
