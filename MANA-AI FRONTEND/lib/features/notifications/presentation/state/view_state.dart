import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';

enum NotificationsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class NotificationsViewState {
  NotificationsViewState({
    required this.phase,
    List<NotificationsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final NotificationsViewPhase phase;
  final List<NotificationsRecord> records;
  final Object? error;
}
