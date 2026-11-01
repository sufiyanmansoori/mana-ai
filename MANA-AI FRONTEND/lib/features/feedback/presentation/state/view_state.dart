import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';

enum FeedbackViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class FeedbackViewState {
  FeedbackViewState({
    required this.phase,
    List<FeedbackRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final FeedbackViewPhase phase;
  final List<FeedbackRecord> records;
  final Object? error;
}
