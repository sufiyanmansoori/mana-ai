import 'dart:convert';

import 'request_cancellation.dart';

enum ApiMethod { get, post, put, patch, delete }

final class ApiRequest {
  ApiRequest({
    required this.method,
    required this.path,
    Map<String, String> queryParameters = const {},
    Map<String, String> headers = const {},
    this.body,
    this.connectTimeout = const Duration(seconds: 10),
    this.receiveTimeout = const Duration(seconds: 30),
    this.cancellation,
  })  : queryParameters = Map.unmodifiable(queryParameters),
        headers = Map.unmodifiable(headers) {
    if (connectTimeout.isNegative ||
        connectTimeout == Duration.zero ||
        receiveTimeout.isNegative ||
        receiveTimeout == Duration.zero) {
      throw ArgumentError('Request timeouts must be positive durations.');
    }
  }

  final ApiMethod method;
  final String path;
  final Map<String, String> queryParameters;
  final Map<String, String> headers;
  final Object? body;
  final Duration connectTimeout;
  final Duration receiveTimeout;
  final RequestCancellation? cancellation;

  bool get isIdempotent =>
      method == ApiMethod.get ||
      method == ApiMethod.put ||
      method == ApiMethod.delete;

  List<int>? get encodedBody =>
      body == null ? null : utf8.encode(jsonEncode(body));

  String get methodName => method.name.toUpperCase();
}
