export interface ContextDocument {
    id: string;
    text: string;
}
export declare function buildContextMessage(documents: readonly ContextDocument[]): string | undefined;
