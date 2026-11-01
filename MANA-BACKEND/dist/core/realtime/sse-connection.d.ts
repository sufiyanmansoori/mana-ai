import type { Response } from 'express';
export interface SseEvent {
    event?: string;
    id?: string;
    data: unknown;
}
export declare class SseConnection {
    private readonly response;
    private open;
    constructor(response: Response);
    send(event: SseEvent): boolean;
    close(): void;
}
