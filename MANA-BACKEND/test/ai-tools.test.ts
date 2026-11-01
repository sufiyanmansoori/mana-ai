import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCodeInterpreterTool } from '../src/ai/tools/code-interpreter-tool.js';
import { createFileReaderTool } from '../src/ai/tools/file-reader-tool.js';
import { createImageGenerationTool } from '../src/ai/tools/image-gen-tool.js';
import { createTool, executeTool } from '../src/ai/tools/tool-executor.js';
import { ToolRegistry } from '../src/ai/tools/tool-registry.js';
import { createWebSearchTool } from '../src/ai/tools/web-search-tool.js';
import { ApiError } from '../src/errors.js';
import { z } from 'zod';

test('tool registry rejects duplicates and exposes metadata only', () => {
  const registry = new ToolRegistry();
  const tool = createTool('echo_tool', 'Echo validated text.', z.object({ value: z.string() }),
    async (input) => input);
  registry.register(tool);
  assert.deepEqual(registry.list(), [{ name: 'echo_tool', description: 'Echo validated text.' }]);
  assert.throws(() => registry.register(tool), /already registered/u);
  assert.throws(() => registry.register({ ...tool, name: 'Bad Name' }), /Tool names/u);
});

test('tool execution validates input and enforces the selected tool allowlist', async () => {
  const registry = new ToolRegistry();
  registry.register(createFileReaderTool());
  await assert.rejects(executeTool(registry, 'read_uploaded_text', {
    filename: '..\\secret.txt',
    mimeType: 'text/plain',
    content: 'private',
  }, { timeoutMs: 1000 }), (error: unknown) =>
    error instanceof ApiError && error.code === 'invalid_tool_input'
  );
  await assert.rejects(executeTool(registry, 'unknown', {}, { timeoutMs: 1000 }),
    (error: unknown) => error instanceof ApiError && error.code === 'tool_not_found');
});

test('code interpreter remains disabled without an injected remote sandbox', async () => {
  const registry = new ToolRegistry();
  registry.register(createCodeInterpreterTool());
  await assert.rejects(executeTool(registry, 'code_interpreter', { code: 'print(1)' }, {
    timeoutMs: 1000,
  }), (error: unknown) =>
    error instanceof ApiError && error.code === 'code_interpreter_not_configured'
  );
});

test('code interpreter sends execution only through an injected network-disabled sandbox', async () => {
  let receivedNetworkAccess: boolean | undefined;
  const registry = new ToolRegistry();
  registry.register(createCodeInterpreterTool({
    async execute(_code, options) {
      receivedNetworkAccess = options.networkAccess;
      return { stdout: '1', stderr: '', exitCode: 0 };
    },
  }));
  const output = await executeTool(registry, 'code_interpreter', { code: 'print(1)' }, {
    timeoutMs: 1000,
  });
  assert.equal(receivedNetworkAccess, false);
  assert.deepEqual(output, { stdout: '1', stderr: '', exitCode: 0 });
});

test('image generation tool validates prompt and forwards the chosen size', async () => {
  const registry = new ToolRegistry();
  registry.register(createImageGenerationTool({
    async generate(input) {
      return { base64: 'aGVsbG8=', mimeType: 'image/png', revisedPrompt: input.prompt };
    },
  }));
  const result = await executeTool(registry, 'generate_image', {
    prompt: 'a tree',
    size: '1024x1024',
  }, { timeoutMs: 1000 });
  assert.deepEqual(result, {
    base64: 'aGVsbG8=',
    mimeType: 'image/png',
    revisedPrompt: 'a tree',
  });
});

test('web search excludes unsafe destination links and marks results untrusted', async () => {
  const registry = new ToolRegistry();
  registry.register(createWebSearchTool({
    async search() {
      return [
        { title: 'Safe', url: 'https://example.com/page', snippet: 'text' },
        { title: 'Local', url: 'http://127.0.0.1/admin', snippet: 'private' },
        { title: 'IPv6 local', url: 'https://[::1]/admin', snippet: 'private' },
        { title: 'Metadata', url: 'https://metadata.google.internal/', snippet: 'private' },
      ];
    },
  }));
  const results = await executeTool(registry, 'web_search', { query: 'query' }, { timeoutMs: 1000 });
  assert.deepEqual(results, [{
    title: 'Safe',
    url: 'https://example.com/page',
    snippet: 'text',
    trusted: false,
  }]);
});

test('tool executor aborts long-running work when its deadline expires', async () => {
  const registry = new ToolRegistry();
  registry.register(createTool('slow_tool', 'Wait for a signal.', z.object({}),
    (_input, signal) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    })));
  await assert.rejects(executeTool(registry, 'slow_tool', {}, { timeoutMs: 5 }));
});
