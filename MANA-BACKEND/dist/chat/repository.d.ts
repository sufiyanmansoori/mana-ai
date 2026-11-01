import type { Pool } from 'pg';
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
export declare class ChatRepository {
    private readonly pool;
    constructor(pool: Pool);
    consumeChatQuota(subject: string, limit: number): Promise<void>;
    ensureConversationAccess(subject: string, conversationId: string): Promise<void>;
    saveTurn(input: {
        subject: string;
        conversationId: string;
        model: string;
        userContent: string;
        assistantContent: string;
    }): Promise<void>;
    listConversations(subject: string, page: number, limit: number, filters?: {
        query?: string;
        folderId?: string;
        pinned?: boolean;
    }): Promise<ConversationSummary[]>;
    listFolders(subject: string): Promise<ConversationFolder[]>;
    createFolder(subject: string, name: string): Promise<ConversationFolder>;
    renameFolder(subject: string, folderId: string, name: string): Promise<void>;
    deleteFolder(subject: string, folderId: string): Promise<void>;
    setPinned(subject: string, conversationId: string, pinned: boolean): Promise<void>;
    setFolder(subject: string, conversationId: string, folderId: string | null): Promise<void>;
    listMessages(subject: string, conversationId: string, limit: number): Promise<MessageRecord[]>;
    renameConversation(subject: string, conversationId: string, title: string): Promise<void>;
    archiveConversation(subject: string, conversationId: string): Promise<void>;
}
