import '../../domain/entities/chat_message.dart';

final class MessageModel {
  const MessageModel({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, Object?> json) {
    final id = json['id'];
    final role = json['role'];
    final content = json['content'];
    final createdAt = json['createdAt'];
    if (id is! String ||
        id.isEmpty ||
        role is! String ||
        content is! String ||
        createdAt is! int) {
      throw const FormatException('Stored chat message is invalid.');
    }

    final parsedRole = switch (role) {
      'user' => ChatMessageRole.user,
      'assistant' => ChatMessageRole.assistant,
      _ => throw const FormatException('Stored chat role is invalid.'),
    };

    return MessageModel(
      id: id,
      role: parsedRole,
      content: content,
      createdAt: DateTime.fromMillisecondsSinceEpoch(createdAt, isUtc: true),
    );
  }

  factory MessageModel.fromEntity(ChatMessage entity) => MessageModel(
        id: entity.id,
        role: entity.role,
        content: entity.content,
        createdAt: entity.createdAt.toUtc(),
      );

  final String id;
  final ChatMessageRole role;
  final String content;
  final DateTime createdAt;

  ChatMessage toEntity() => ChatMessage(
        id: id,
        role: role,
        content: content,
        createdAt: createdAt,
      );

  Map<String, Object?> toJson() => {
        'id': id,
        'role': role.name,
        'content': content,
        'createdAt': createdAt.millisecondsSinceEpoch,
      };
}
