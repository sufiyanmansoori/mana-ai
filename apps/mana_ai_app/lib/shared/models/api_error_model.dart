import '../../core/foundation/app_failure.dart';

final class ApiErrorModel {
  const ApiErrorModel({
    required this.code,
    required this.message,
    this.requestId,
  });

  final String code;
  final String message;
  final String? requestId;

  factory ApiErrorModel.fromJson(Map<String, Object?> json) {
    final code = json['code'];
    final message = json['message'];
    final requestId = json['requestId'];
    if (code is! String ||
        code.isEmpty ||
        message is! String ||
        message.isEmpty ||
        (requestId != null && requestId is! String)) {
      throw const FormatException('API error response is malformed.');
    }
    return ApiErrorModel(
      code: code,
      message: message,
      requestId: requestId as String?,
    );
  }

  AppFailure toFailure() => AppFailure(
        kind: FailureKind.unknown,
        code: code,
        message: message,
      );
}
