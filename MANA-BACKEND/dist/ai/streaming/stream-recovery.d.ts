export interface ReplayEvent<T> {
    id: number;
    data: T;
}
export interface ReplayResult<T> {
    events: ReplayEvent<T>[];
    complete: boolean;
}
export declare class InMemoryReplayBuffer<T> {
    private readonly capacity;
    private events;
    private nextId;
    constructor(capacity: number);
    append(data: T): ReplayEvent<T>;
    replayAfter(id: number): ReplayResult<T>;
}
