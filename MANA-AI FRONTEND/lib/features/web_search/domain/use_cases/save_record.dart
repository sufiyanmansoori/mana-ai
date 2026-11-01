import 'package:mana_ai_app/features/web_search/domain/entities/record.dart';
import 'package:mana_ai_app/features/web_search/domain/repositories/feature_repository.dart';

final class WebSearchSaveRecord {
  const WebSearchSaveRecord(this._repository);

  final WebSearchFeatureRepository _repository;

  Future<void> call(WebSearchRecord record) => _repository.save(record);
}
