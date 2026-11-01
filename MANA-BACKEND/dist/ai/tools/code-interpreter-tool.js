import { z } from 'zod';
import { ApiError } from '../../errors.js';
import { createTool } from './tool-executor.js';
const CodeInput = z.object({
    code: z.string().trim().min(1).max(20_000),
}).strict();
export function createCodeInterpreterTool(sandbox) {
    return createTool('code_interpreter', 'Run code in a separately managed, network-disabled sandbox.', CodeInput, async (input, signal) => {
        if (!sandbox) {
            throw new ApiError(503, 'code_interpreter_not_configured', 'A remote code sandbox is not configured.');
        }
        const parsed = CodeInput.parse(input);
        return sandbox.execute(parsed.code, { signal, networkAccess: false });
    });
}
//# sourceMappingURL=code-interpreter-tool.js.map