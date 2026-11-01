export interface SseEvent<T> {
    event?: string;
    id?: string;
    data: T;
}
export declare function formatSseEvent<T>(input: SseEvent<T>): string;
