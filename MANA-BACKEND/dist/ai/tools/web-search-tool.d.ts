export interface WebSearchResult {
    title: string;
    url: string;
    snippet: string;
}
export interface WebSearchProvider {
    search(query: string, signal: AbortSignal): Promise<readonly WebSearchResult[]>;
}
export declare function createWebSearchTool(provider: WebSearchProvider, maximumResults?: number): import("./tool-registry.js").AiTool;
