import { z } from 'zod';
import { createTool } from './tool-executor.js';
const MAX_FILE_CHARACTERS = 1_000_000;
const FileInput = z.object({
    filename: z.string().min(1).max(255).refine((name) => !/[/\\\0\r\n]/u.test(name) && name !== '.' && name !== '..'),
    mimeType: z.enum(['text/plain', 'text/csv', 'application/json']),
    content: z.string().max(MAX_FILE_CHARACTERS),
}).strict();
export function createFileReaderTool() {
    return createTool('read_uploaded_text', 'Read already-extracted text from a validated, uploaded text document.', FileInput, async (input) => {
        const parsed = FileInput.parse(input);
        return {
            filename: parsed.filename,
            mimeType: parsed.mimeType,
            content: parsed.content,
            trusted: false,
        };
    });
}
//# sourceMappingURL=file-reader-tool.js.map