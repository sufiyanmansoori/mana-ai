import 'package:mana_ai_app/features/authentication/domain/entities/record.dart';
import 'package:mana_ai_app/features/authentication/data/models/record_model.dart';

abstract final class AuthenticationRecordMapper {
  static AuthenticationRecord fromModel(
    AuthenticationRecordModel model,
  ) =>
      AuthenticationRecord(id: model.id, createdAt: model.createdAt);

  static AuthenticationRecordModel toModel(
    AuthenticationRecord record,
  ) =>
      AuthenticationRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
