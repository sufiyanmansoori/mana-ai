import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { ApiError } from '../errors.js';

export interface ConversationSummary {
  id: string;
  title: string;
  model: string;
  folder_id: string | null;
  pinned_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationFolder {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface MessageRecord {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string | null;
  created_at: Date;
}

export class ChatRepository {
  constructor(private readonly pool: Pool) {}

  async consumeChatQuota(subject: string, limit: number): Promise<void> {
    const result = await this.pool.query(
      `INSERT INTO rate_limit_windows (owner_subject, window_start, request_count)
       VALUES ($1, date_trunc('minute', now()), 1)
       ON CONFLICT (owner_subject, window_start)
       DO UPDATE SET request_count = rate_limit_windows.request_count + 1
       WHERE rate_limit_windows.request_count < $2
       RETURNING request_count`,
      [subject, limit],
    );
    if (result.rowCount === 0) {
      throw new ApiError(429, 'chat_rate_limit_exceeded', 'The chat request limit has been reached. Try again shortly.');
    }
  }

  async ensureConversationAccess(subject: string, conversationId: string): Promise<void> {
    const result = await this.pool.query(
      `SELECT id FROM conversations
       WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL`,
      [conversationId, subject],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'conversation_not_found', 'The conversation was not found.');
    }
  }

  async saveTurn(input: {
    subject: string;
    conversationId: string;
    model: string;
    userContent: string;
    assistantContent: string;
  }): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query(
        `SELECT id FROM conversations
         WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL
         FOR UPDATE`,
        [input.conversationId, input.subject],
      );
      if (existing.rowCount === 0) {
        const title = input.userContent.replace(/\s+/g, ' ').trim().slice(0, 117);
        await client.query(
          `INSERT INTO conversations (id, owner_subject, title, model)
           VALUES ($1, $2, $3, $4)`,
          [input.conversationId, input.subject, title || 'New conversation', input.model],
        );
      } else {
        await client.query(
          `UPDATE conversations SET model = $3, updated_at = now()
           WHERE id = $1 AND owner_subject = $2`,
          [input.conversationId, input.subject, input.model],
        );
      }

      await client.query(
        `INSERT INTO messages (id, conversation_id, role, content, model)
         VALUES ($1, $2, 'user', $3, $4), ($5, $2, 'assistant', $6, $4)`,
        [randomUUID(), input.conversationId, input.userContent, input.model,
          randomUUID(), input.assistantContent],
      );
      await client.query('COMMIT');
    } catch (error) {
      await rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }

  async listConversations(
    subject: string,
    page: number,
    limit: number,
    filters: { query?: string; folderId?: string; pinned?: boolean } = {},
  ): Promise<ConversationSummary[]> {
    const conditions = ['owner_subject = $1', 'archived_at IS NULL'];
    const values: unknown[] = [subject];
    if (filters.folderId) {
      values.push(filters.folderId);
      conditions.push(`folder_id = $${values.length}`);
    }
    if (filters.pinned !== undefined) {
      conditions.push(filters.pinned ? 'pinned_at IS NOT NULL' : 'pinned_at IS NULL');
    }
    if (filters.query) {
      const escapedQuery = filters.query.replace(/[\\%_]/g, '\\$&');
      values.push(`%${escapedQuery}%`);
      const queryParameter = `$${values.length}`;
      conditions.push(
        `(title ILIKE ${queryParameter} ESCAPE '\\' OR EXISTS (
          SELECT 1 FROM messages m
          WHERE m.conversation_id = conversations.id
            AND m.content ILIKE ${queryParameter} ESCAPE '\\'
        ))`,
      );
    }
    values.push(limit, (page - 1) * limit);
    const result = await this.pool.query<ConversationSummary>(
      `SELECT id, title, model, folder_id, pinned_at, created_at, updated_at
       FROM conversations
       WHERE ${conditions.join(' AND ')}
       ORDER BY (pinned_at IS NOT NULL) DESC, pinned_at DESC, updated_at DESC, id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    return result.rows;
  }

  async listFolders(subject: string): Promise<ConversationFolder[]> {
    const result = await this.pool.query<ConversationFolder>(
      `SELECT id, name, created_at, updated_at
       FROM conversation_folders
       WHERE owner_subject = $1
       ORDER BY lower(name), id`,
      [subject],
    );
    return result.rows;
  }

  async createFolder(subject: string, name: string): Promise<ConversationFolder> {
    const result = await this.pool.query<ConversationFolder>(
      `INSERT INTO conversation_folders (id, owner_subject, name)
       VALUES ($1, $2, $3)
       RETURNING id, name, created_at, updated_at`,
      [randomUUID(), subject, name],
    );
    return result.rows[0]!;
  }

  async renameFolder(subject: string, folderId: string, name: string): Promise<void> {
    const result = await this.pool.query(
      `UPDATE conversation_folders
       SET name = $3, updated_at = now()
       WHERE id = $1 AND owner_subject = $2`,
      [folderId, subject, name],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'folder_not_found', 'The conversation folder was not found.');
    }
  }

  async deleteFolder(subject: string, folderId: string): Promise<void> {
    const result = await this.pool.query(
      'DELETE FROM conversation_folders WHERE id = $1 AND owner_subject = $2',
      [folderId, subject],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'folder_not_found', 'The conversation folder was not found.');
    }
  }

  async setPinned(subject: string, conversationId: string, pinned: boolean): Promise<void> {
    const result = await this.pool.query(
      `UPDATE conversations
       SET pinned_at = CASE WHEN $3 THEN COALESCE(pinned_at, now()) ELSE NULL END,
           updated_at = now()
       WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL`,
      [conversationId, subject, pinned],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'conversation_not_found', 'The conversation was not found.');
    }
  }

  async setFolder(
    subject: string,
    conversationId: string,
    folderId: string | null,
  ): Promise<void> {
    const result = await this.pool.query(
      `UPDATE conversations
       SET folder_id = $3, updated_at = now()
       WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL
         AND ($3::uuid IS NULL OR EXISTS (
           SELECT 1 FROM conversation_folders f
           WHERE f.id = $3 AND f.owner_subject = $2
         ))`,
      [conversationId, subject, folderId],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'conversation_or_folder_not_found', 'The conversation or folder was not found.');
    }
  }

  async listMessages(subject: string, conversationId: string, limit: number): Promise<MessageRecord[]> {
    await this.ensureConversationAccess(subject, conversationId);
    const result = await this.pool.query<MessageRecord>(
      `SELECT m.id, m.role, m.content, m.model, m.created_at
       FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE c.id = $1 AND c.owner_subject = $2 AND c.archived_at IS NULL
       ORDER BY m.created_at ASC, m.id ASC
       LIMIT $3`,
      [conversationId, subject, limit],
    );
    return result.rows;
  }

  async renameConversation(subject: string, conversationId: string, title: string): Promise<void> {
    const result = await this.pool.query(
      `UPDATE conversations SET title = $3, updated_at = now()
       WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL`,
      [conversationId, subject, title],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'conversation_not_found', 'The conversation was not found.');
    }
  }

  async archiveConversation(subject: string, conversationId: string): Promise<void> {
    const result = await this.pool.query(
      `UPDATE conversations SET archived_at = now(), updated_at = now()
       WHERE id = $1 AND owner_subject = $2 AND archived_at IS NULL`,
      [conversationId, subject],
    );
    if (result.rowCount === 0) {
      throw new ApiError(404, 'conversation_not_found', 'The conversation was not found.');
    }
  }
}

async function rollback(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } catch {
    // Preserve the original transaction error.
  }
}
