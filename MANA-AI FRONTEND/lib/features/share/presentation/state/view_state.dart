import 'package:mana_ai_app/features/share/domain/entities/record.dart';

enum ShareViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ShareViewState {
  ShareViewState({
    required this.phase,
    List<ShareRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ShareViewPhase phase;
  final List<ShareRecord> records;
  final Object? error;
}
