import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';

enum WebSearchViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class WebSearchViewState {
  WebSearchViewState({
    required this.phase,
    List<WebSearchRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final WebSearchViewPhase phase;
  final List<WebSearchRecord> records;
  final Object? error;
}
