import { ZodError } from 'zod';
import { ApiError } from '../../errors.js';
import type { AiTool, ToolRegistry } from './tool-registry.js';

export async function executeTool(
  registry: ToolRegistry,
  name: string,
  input: unknown,
  options: { timeoutMs: number; signal?: AbortSignal },
): Promise<unknown> {
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1 || options.timeoutMs > 300_000) {
    throw new RangeError('Tool timeout must be between 1 and 300000 milliseconds.');
  }
  const tool = registry.get(name);
  if (!tool) throw new ApiError(404, 'tool_not_found', 'The requested tool is not available.');

  let parsed: unknown;
  try {
    parsed = tool.inputSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, 'invalid_tool_input', 'The tool input is invalid.');
    }
    throw error;
  }

  if (options.signal?.aborted) throw options.signal.reason;
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(options.signal?.reason);
  options.signal?.addEventListener('abort', abortFromCaller, { once: true });
  const timeout = setTimeout(() => {
    controller.abort(new Error('Tool execution exceeded its deadline.'));
  }, options.timeoutMs);

  const abort = new Promise<never>((_resolve, reject) => {
    controller.signal.addEventListener('abort', () => reject(controller.signal.reason), {
      once: true,
    });
  });
  try {
    return await Promise.race([tool.execute(parsed, controller.signal), abort]);
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function createTool(name: string, description: string, inputSchema: AiTool['inputSchema'],
  execute: AiTool['execute']): AiTool {
  return { name, description, inputSchema, execute };
}
