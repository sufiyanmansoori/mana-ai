import type { AiTool, ToolRegistry } from './tool-registry.js';
export declare function executeTool(registry: ToolRegistry, name: string, input: unknown, options: {
    timeoutMs: number;
    signal?: AbortSignal;
}): Promise<unknown>;
export declare function createTool(name: string, description: string, inputSchema: AiTool['inputSchema'], execute: AiTool['execute']): AiTool;
