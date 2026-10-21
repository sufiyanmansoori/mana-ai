import { z } from 'zod';
const ModelNameSchema = z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9._:-]+$/);
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
    title: z.string().trim().min(1).max(120),
}).strict();
export const ListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).max(10000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    q: z.string().trim().min(1).max(120).optional(),
    folder_id: z.string().uuid().optional(),
    pinned: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
});
export const FolderSchema = z.object({
    name: z.string().trim().min(1).max(40),
}).strict();
export const PinConversationSchema = z.object({
    pinned: z.boolean(),
}).strict();
export const ConversationFolderAssignmentSchema = z.object({
    folder_id: z.string().uuid().nullable(),
}).strict();
export const MessageQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(100),
});
//# sourceMappingURL=schemas.js.map