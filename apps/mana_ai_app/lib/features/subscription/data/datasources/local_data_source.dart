import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';

abstract interface class SubscriptionLocalDataSource {
  Future<List<SubscriptionRecord>> readAll();

  Future<SubscriptionRecord?> getById(String id);

  Future<void> save(SubscriptionRecord record);

  Future<void> delete(String id);
}
