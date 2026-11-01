import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';

enum AttachmentsViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class AttachmentsViewState {
  AttachmentsViewState({
    required this.phase,
    List<AttachmentsRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final AttachmentsViewPhase phase;
  final List<AttachmentsRecord> records;
  final Object? error;
}
