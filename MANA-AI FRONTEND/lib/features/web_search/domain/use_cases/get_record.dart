import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';
import 'package:mana_ai_app/features/web_search/domain/repositories/feature_repository.dart';

final class WebSearchGetRecord {
  const WebSearchGetRecord(this._repository);

  final WebSearchFeatureRepository _repository;

  Future<WebSearchRecord?> call(String id) => _repository.getById(id);
}
