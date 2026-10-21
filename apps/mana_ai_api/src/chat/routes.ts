import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { Router, type Response } from 'express';
import type { AppConfig } from '../config.js';
import { requireAuthentication } from '../auth/middleware.js';
import type { TokenVerifier } from '../auth/tokens.js';
import { ApiError } from '../errors.js';
import type { AppLogger } from '../logger.js';
import { ChatRepository } from './repository.js';
import { ChatService } from './service.js';
import {
  chatRequestSchema,
  ConversationFolderAssignmentSchema,
  FolderSchema,
  ListQuerySchema,
  MessageQuerySchema,
  PinConversationSchema,
  RenameConversationSchema,
} from './schemas.js';

export interface ChatRouteDependencies {
  config: AppConfig;
  verifier: TokenVerifier;
  repository: ChatRepository;
  service: ChatService;
  logger: AppLogger;
}

export function createChatRouter(dependencies: ChatRouteDependencies): Router {
  const router = Router();
  const authenticate = requireAuthentication(dependencies.verifier);

  router.get('/me', authenticate, (request, response) => {
    response.json({ subject: request.auth!.subject });
  });

  router.get('/models', authenticate, (_request, response) => {
    response.json({
      data: dependencies.config.aiAllowedModels.map((id) => ({
        id,
        object: 'model',
        owned_by: 'mana-ai',
      })),
    });
  });

  router.get('/conversations', authenticate, async (request, response, next) => {
    try {
      const { page, limit, q, folder_id, pinned } = ListQuerySchema.parse(request.query);
      const data = await dependencies.repository.listConversations(
        request.auth!.subject,
        page,
        limit,
        {
          ...(q ? { query: q } : {}),
          ...(folder_id ? { folderId: folder_id } : {}),
          ...(pinned !== undefined ? { pinned } : {}),
        },
      );
      response.json({ data, page, limit });
    } catch (error) {
      next(error);
    }
  });

  router.get('/conversation-folders', authenticate, async (request, response, next) => {
    try {
      const data = await dependencies.repository.listFolders(request.auth!.subject);
      response.json({ data });
    } catch (error) {
      next(error);
    }
  });

  router.post('/conversation-folders', authenticate, async (request, response, next) => {
    try {
      const { name } = FolderSchema.parse(request.body);
      const folder = await dependencies.repository.createFolder(request.auth!.subject, name);
      response.status(201).json({ data: folder });
    } catch (error) {
      next(mapUniqueConflict(error, 'folder_name_conflict', 'A folder with this name already exists.'));
    }
  });

  router.patch('/conversation-folders/:id', authenticate, async (request, response, next) => {
    try {
      const folderId = parseConversationId(request.params.id);
      const { name } = FolderSchema.parse(request.body);
      await dependencies.repository.renameFolder(request.auth!.subject, folderId, name);
      response.status(204).end();
    } catch (error) {
      next(mapUniqueConflict(error, 'folder_name_conflict', 'A folder with this name already exists.'));
    }
  });

  router.delete('/conversation-folders/:id', authenticate, async (request, response, next) => {
    try {
      await dependencies.repository.deleteFolder(
        request.auth!.subject,
        parseConversationId(request.params.id),
      );
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.get('/conversations/:id/messages', authenticate, async (request, response, next) => {
    try {
      const conversationId = parseConversationId(request.params.id);
      const { limit } = MessageQuerySchema.parse(request.query);
      const data = await dependencies.repository.listMessages(
        request.auth!.subject,
        conversationId,
        limit,
      );
      response.json({ data });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/conversations/:id', authenticate, async (request, response, next) => {
    try {
      const conversationId = parseConversationId(request.params.id);
      const { title } = RenameConversationSchema.parse(request.body);
      await dependencies.repository.renameConversation(request.auth!.subject, conversationId, title);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.patch('/conversations/:id/pin', authenticate, async (request, response, next) => {
    try {
      const conversationId = parseConversationId(request.params.id);
      const { pinned } = PinConversationSchema.parse(request.body);
      await dependencies.repository.setPinned(request.auth!.subject, conversationId, pinned);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.patch('/conversations/:id/folder', authenticate, async (request, response, next) => {
    try {
      const conversationId = parseConversationId(request.params.id);
      const { folder_id } = ConversationFolderAssignmentSchema.parse(request.body);
      await dependencies.repository.setFolder(
        request.auth!.subject,
        conversationId,
        folder_id,
      );
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.delete('/conversations/:id', authenticate, async (request, response, next) => {
    try {
      const conversationId = parseConversationId(request.params.id);
      await dependencies.repository.archiveConversation(request.auth!.subject, conversationId);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.post('/chat/completions', authenticate, async (request, response, next) => {
    const schema = chatRequestSchema(
      dependencies.config.chatMaxInputMessages,
      dependencies.config.chatMaxMessageCharacters,
    );
    const abortController = new AbortController();
    response.on('close', () => {
      if (!response.writableEnded) abortController.abort();
    });

    try {
      const input = schema.parse(request.body);
      const completion = await dependencies.service.prepare(
        request.auth!.subject,
        input,
        abortController.signal,
      );
      response.status(200);
      response.set({
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
        'x-conversation-id': completion.conversationId,
      });
      response.flushHeaders();

      let assistantContent = '';
      try {
        for await (const chunk of completion.chunks) {
          if (abortController.signal.aborted) return;
          if (chunk.content) {
            assistantContent += chunk.content;
            await writeSse(response, {
              id: `chatcmpl-${randomUUID()}`,
              object: 'chat.completion.chunk',
              model: completion.model,
              choices: [{ index: 0, delta: { content: chunk.content }, finish_reason: null }],
            });
          }
        }
        await completion.persist(assistantContent);
        await writeSse(response, '[DONE]');
        response.end();
      } catch (error) {
        if (abortController.signal.aborted) return;
        const apiError = error instanceof ApiError
          ? error
          : new ApiError(502, 'chat_stream_failed', 'The chat response could not be completed.');
        dependencies.logger.error({
          requestId: request.requestId,
          code: apiError.code,
        }, 'Chat stream failed');
        await writeSse(response, {
          error: { code: apiError.code, message: apiError.message },
        });
        response.end();
      }
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function parseConversationId(value: string | string[] | undefined): string {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  ) {
    throw new ApiError(400, 'invalid_conversation_id', 'The conversation ID is invalid.');
  }
  return value;
}

function mapUniqueConflict(
  error: unknown,
  code: string,
  message: string,
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  ) {
    return new ApiError(409, code, message);
  }
  return error;
}

async function writeSse(response: Response, payload: unknown): Promise<void> {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  if (response.write(`data: ${data}\n\n`)) return;
  await Promise.race([
    once(response, 'drain'),
    once(response, 'close'),
  ]);
}
