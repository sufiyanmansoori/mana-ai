import { z } from 'zod';
export declare function chatRequestSchema(maxMessages: number, maxCharacters: number): z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    stream: z.ZodDefault<z.ZodLiteral<true>>;
    conversation_id: z.ZodOptional<z.ZodString>;
    messages: z.ZodEffects<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        content: string;
        role: "user" | "assistant" | "system";
    }, {
        content: string;
        role: "user" | "assistant" | "system";
    }>, "many">, {
        content: string;
        role: "user" | "assistant" | "system";
    }[], {
        content: string;
        role: "user" | "assistant" | "system";
    }[]>;
}, "strict", z.ZodTypeAny, {
    stream: true;
    messages: {
        content: string;
        role: "user" | "assistant" | "system";
    }[];
    model?: string | undefined;
    conversation_id?: string | undefined;
}, {
    messages: {
        content: string;
        role: "user" | "assistant" | "system";
    }[];
    stream?: true | undefined;
    model?: string | undefined;
    conversation_id?: string | undefined;
}>;
export declare const RenameConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, "strict", z.ZodTypeAny, {
    title: string;
}, {
    title: string;
}>;
export declare const ListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    folder_id: z.ZodOptional<z.ZodString>;
    pinned: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    q?: string | undefined;
    folder_id?: string | undefined;
    pinned?: boolean | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    folder_id?: string | undefined;
    pinned?: "true" | "false" | undefined;
}>;
export declare const FolderSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export declare const PinConversationSchema: z.ZodObject<{
    pinned: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    pinned: boolean;
}, {
    pinned: boolean;
}>;
export declare const ConversationFolderAssignmentSchema: z.ZodObject<{
    folder_id: z.ZodNullable<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    folder_id: string | null;
}, {
    folder_id: string | null;
}>;
export declare const MessageQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
}, {
    limit?: number | undefined;
}>;
export type ChatRequest = z.infer<ReturnType<typeof chatRequestSchema>>;
