import type { ModerationFinding, ModerationProvider } from './input-moderation.js';
export declare function moderateOutput(text: string, provider: ModerationProvider, signal?: AbortSignal): Promise<ModerationFinding>;
