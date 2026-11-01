import type { ZodType } from 'zod';

export interface AiTool {
  name: string;
  description: string;
  inputSchema: ZodType;
  execute(input: unknown, signal: AbortSignal): Promise<unknown>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, AiTool>();

  register(tool: AiTool): void {
    if (!/^[a-z][a-z0-9_]{1,63}$/u.test(tool.name)) {
      throw new TypeError('Tool names must be 2-64 lowercase letters, digits, or underscores.');
    }
    if (this.tools.has(tool.name)) throw new Error(`Tool "${tool.name}" is already registered.`);
    this.tools.set(tool.name, tool);
  }

  get(name: string): AiTool | undefined {
    return this.tools.get(name);
  }

  list(): Array<Pick<AiTool, 'name' | 'description'>> {
    return [...this.tools.values()].map(({ name, description }) => ({ name, description }));
  }
}
