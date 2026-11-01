export class InMemoryReplayBuffer {
    capacity;
    events = [];
    nextId = 1;
    constructor(capacity) {
        this.capacity = capacity;
        if (!Number.isInteger(capacity) || capacity < 1) {
            throw new RangeError('Replay buffer capacity must be a positive integer.');
        }
    }
    append(data) {
        const event = { id: this.nextId, data };
        this.nextId += 1;
        this.events.push(event);
        if (this.events.length > this.capacity)
            this.events.shift();
        return event;
    }
    replayAfter(id) {
        if (!Number.isSafeInteger(id) || id < 0) {
            throw new RangeError('Replay cursor must be a non-negative safe integer.');
        }
        if (id >= this.nextId)
            throw new RangeError('Replay cursor is newer than the latest event.');
        const earliestAvailableId = this.events[0]?.id ?? this.nextId;
        return {
            events: this.events.filter((event) => event.id > id),
            complete: id >= earliestAvailableId - 1,
        };
    }
}
//# sourceMappingURL=stream-recovery.js.map