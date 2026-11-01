export interface ModerationFinding {
    flagged: boolean;
    categories?: readonly string[];
}
export interface ModerationProvider {
    moderate(text: string, signal?: AbortSignal): Promise<ModerationFinding>;
}
export declare function moderateInput(text: string, provider: ModerationProvider, signal?: AbortSignal): Promise<ModerationFinding>;
