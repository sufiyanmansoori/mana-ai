import type { ZodType } from 'zod';
export interface AiTool {
    name: string;
    description: string;
    inputSchema: ZodType;
    execute(input: unknown, signal: AbortSignal): Promise<unknown>;
}
export declare class ToolRegistry {
    private readonly tools;
    register(tool: AiTool): void;
    get(name: string): AiTool | undefined;
    list(): Array<Pick<AiTool, 'name' | 'description'>>;
}
