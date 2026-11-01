import { z } from 'zod';
export declare function chatRequestSchema(maxMessages: number, maxCharacters: number): z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    stream: z.ZodDefault<z.ZodLiteral<true>>;
    conversation_id: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
            system: "system";
        }>;
        content: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const RenameConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strict>;
export declare const ListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    q: z.ZodOptional<z.ZodString>;
    folder_id: z.ZodOptional<z.ZodString>;
    pinned: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
}, z.core.$strip>;
export declare const FolderSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strict>;
export declare const PinConversationSchema: z.ZodObject<{
    pinned: z.ZodBoolean;
}, z.core.$strict>;
export declare const ConversationFolderAssignmentSchema: z.ZodObject<{
    folder_id: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const MessageQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type ChatRequest = z.infer<ReturnType<typeof chatRequestSchema>>;
