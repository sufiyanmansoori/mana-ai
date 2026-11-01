import 'package:http/http.dart' as http;
import 'package:mana_ai_app/core/config/api_endpoint.dart';
import 'package:mana_ai_app/core/network/interceptors/auth_interceptor.dart';
import 'package:mana_ai_app/core/network/request_headers.dart';
import 'package:mana_ai_app/core/storage/secure_key_value_store.dart';

import '../data/datasources/chat_database.dart';
import '../data/datasources/chat_local_datasource_impl.dart';
import '../data/datasources/chat_remote_datasource_impl.dart';
import '../data/repositories/chat_repository_impl.dart';
import '../domain/usecases/send_message_usecase.dart';
import '../presentation/controllers/chat_session_controller.dart';

abstract final class ChatSessionFactory {
  static ChatSessionController create({
    required ChatDatabase database,
    required ApiEndpoint endpoint,
    required http.Client client,
    required SecureKeyValueStore secureStorage,
    String conversationId = 'current',
    String streamPath = 'v1/chat/completions',
  }) {
    final repository = ChatConversationRepositoryImpl(
      localDataSource: DriftChatLocalDataSource(database),
      remoteDataSource: OpenAiCompatibleChatRemoteDataSource(
        endpoint: endpoint,
        client: client,
        headers: RequestHeaders(
          interceptors: [AuthInterceptor(secureStorage)],
        ),
        path: streamPath,
      ),
      conversationId: conversationId,
    );
    return ChatSessionController(
      repository: repository,
      sendMessage: SendMessageUseCase(repository),
    );
  }
}
