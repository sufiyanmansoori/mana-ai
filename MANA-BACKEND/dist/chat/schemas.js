import { z } from 'zod';
import { LIMITS } from '../constants/limits.js';
import { REGEX } from '../constants/regex.js';
const ModelNameSchema = z.string()
    .trim()
    .min(LIMITS.modelIdCharacters.min)
    .max(LIMITS.modelIdCharacters.max)
    .regex(REGEX.modelId);
export function chatRequestSchema(maxMessages, maxCharacters) {
    return z.object({
        model: ModelNameSchema.optional(),
        stream: z.literal(true).default(true),
        conversation_id: z.string().uuid().optional(),
        messages: z.array(z.object({
            role: z.enum(['system', 'user', 'assistant']),
            content: z.string().min(1).max(maxCharacters),
        }).strict()).min(1).max(maxMessages).refine((messages) => messages.some((message) => message.role === 'user'), 'At least one user message is required.'),
    }).strict();
}
export const RenameConversationSchema = z.object({
    title: z.string().trim()
        .min(LIMITS.conversationTitleCharacters.min)
        .max(LIMITS.conversationTitleCharacters.max),
}).strict();
export const ListQuerySchema = z.object({
    page: z.coerce.number().int()
        .min(LIMITS.conversationPage.min).max(LIMITS.conversationPage.max)
        .default(LIMITS.conversationPage.default),
    limit: z.coerce.number().int()
        .min(LIMITS.conversationPageSize.min).max(LIMITS.conversationPageSize.max)
        .default(LIMITS.conversationPageSize.default),
    q: z.string().trim().min(1).max(120).optional(),
    folder_id: z.string().uuid().optional(),
    pinned: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
});
export const FolderSchema = z.object({
    name: z.string().trim()
        .min(LIMITS.folderNameCharacters.min).max(LIMITS.folderNameCharacters.max),
}).strict();
export const PinConversationSchema = z.object({
    pinned: z.boolean(),
}).strict();
export const ConversationFolderAssignmentSchema = z.object({
    folder_id: z.string().uuid().nullable(),
}).strict();
export const MessageQuerySchema = z.object({
    limit: z.coerce.number().int()
        .min(LIMITS.messagePageSize.min).max(LIMITS.messagePageSize.max)
        .default(LIMITS.messagePageSize.max),
});
//# sourceMappingURL=schemas.js.map