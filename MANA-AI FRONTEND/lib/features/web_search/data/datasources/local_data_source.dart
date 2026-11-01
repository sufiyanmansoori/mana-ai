import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';

abstract interface class WebSearchLocalDataSource {
  Future<List<WebSearchRecord>> readAll();

  Future<WebSearchRecord?> getById(String id);

  Future<void> save(WebSearchRecord record);

  Future<void> delete(String id);
}
