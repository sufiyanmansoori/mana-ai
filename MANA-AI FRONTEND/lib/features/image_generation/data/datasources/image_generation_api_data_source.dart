import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;

import '../../../../core/config/api_endpoint.dart';
import '../../../../core/storage/secure_key_value_store.dart';

final class GeneratedImage {
  const GeneratedImage({
    required this.bytes,
    required this.mimeType,
    this.revisedPrompt,
  });

  final Uint8List bytes;
  final String mimeType;
  final String? revisedPrompt;
}

final class ImageGenerationApiDataSource {
  ImageGenerationApiDataSource({
    required ApiEndpoint endpoint,
    required http.Client client,
    required SecureKeyValueStore secureStorage,
    this.requestTimeout = const Duration(minutes: 3),
  })  : _endpoint = endpoint,
        _client = client,
        _secureStorage = secureStorage {
    if (requestTimeout <= Duration.zero) {
      throw ArgumentError.value(requestTimeout, 'requestTimeout');
    }
  }

  final ApiEndpoint _endpoint;
  final http.Client _client;
  final SecureKeyValueStore _secureStorage;
  final Duration requestTimeout;

  Future<GeneratedImage> generate({
    required String prompt,
    required String size,
  }) async {
    final normalizedPrompt = prompt.trim();
    if (normalizedPrompt.isEmpty || normalizedPrompt.length > 4000) {
      throw const ImageGenerationApiException(
        'Describe the image in 1–4,000 characters.',
      );
    }
    if (!const {'1024x1024', '1536x1024', '1024x1536'}.contains(size)) {
      throw const ImageGenerationApiException('Choose a supported image size.');
    }

    final token = _secureStorage.readAccessTokenSync() ??
        await _secureStorage.read('auth.access_token');
    if (token == null || token.trim().isEmpty) {
      throw const ImageGenerationApiException(
        'Sign in to Mana AI before generating images.',
      );
    }

    late final http.Response response;
    try {
      response = await _client
          .post(
            _endpoint.resolve('v1/images/generations'),
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'authorization': 'Bearer ${token.trim()}',
            },
            body: jsonEncode({'prompt': normalizedPrompt, 'size': size}),
          )
          .timeout(requestTimeout);
    } on TimeoutException {
      throw const ImageGenerationApiException(
        'Image generation took too long. Please try again.',
      );
    } on http.ClientException {
      throw const ImageGenerationApiException(
        'The Mana AI image service could not be reached.',
      );
    }

    final payload = _decodeObject(response.body);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final error = payload['error'];
      final message = error is Map<String, dynamic> &&
              error['message'] is String
          ? error['message'] as String
          : null;
      throw ImageGenerationApiException(
        message ?? switch (response.statusCode) {
          401 => 'Your session expired. Sign in again to continue.',
          429 => 'Image generation is rate limited. Wait a moment and retry.',
          _ => 'The image service could not complete this request '
              '(HTTP ${response.statusCode}).',
        },
      );
    }

    final data = payload['data'];
    if (data is! Map<String, dynamic>) {
      throw const ImageGenerationApiException(
        'The image service returned an invalid response.',
      );
    }
    final encoded = data['base64'];
    final mimeType = data['mimeType'];
    final revisedPrompt = data['revisedPrompt'];
    if (encoded is! String ||
        mimeType is! String ||
        !const {'image/png', 'image/jpeg', 'image/webp'}.contains(mimeType)) {
      throw const ImageGenerationApiException(
        'The image service returned an unsupported image.',
      );
    }
    try {
      final bytes = base64Decode(encoded);
      if (bytes.isEmpty || bytes.length > 12 * 1024 * 1024) {
        throw const ImageGenerationApiException(
          'The generated image exceeded the supported size.',
        );
      }
      return GeneratedImage(
        bytes: Uint8List.fromList(bytes),
        mimeType: mimeType,
        revisedPrompt: revisedPrompt is String ? revisedPrompt : null,
      );
    } on FormatException {
      throw const ImageGenerationApiException(
        'The image service returned corrupted image data.',
      );
    }
  }

  Map<String, dynamic> _decodeObject(String body) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) return decoded;
    } on FormatException {
      throw const ImageGenerationApiException(
        'The image service returned an invalid response.',
      );
    }
    throw const ImageGenerationApiException(
      'The image service returned an invalid response.',
    );
  }
}

final class ImageGenerationApiException implements Exception {
  const ImageGenerationApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
