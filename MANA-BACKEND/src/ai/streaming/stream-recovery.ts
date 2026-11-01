export interface ReplayEvent<T> {
  id: number;
  data: T;
}

export interface ReplayResult<T> {
  events: ReplayEvent<T>[];
  complete: boolean;
}

export class InMemoryReplayBuffer<T> {
  private events: ReplayEvent<T>[] = [];
  private nextId = 1;

  constructor(private readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError('Replay buffer capacity must be a positive integer.');
    }
  }

  append(data: T): ReplayEvent<T> {
    const event = { id: this.nextId, data };
    this.nextId += 1;
    this.events.push(event);
    if (this.events.length > this.capacity) this.events.shift();
    return event;
  }

  replayAfter(id: number): ReplayResult<T> {
    if (!Number.isSafeInteger(id) || id < 0) {
      throw new RangeError('Replay cursor must be a non-negative safe integer.');
    }
    if (id >= this.nextId) throw new RangeError('Replay cursor is newer than the latest event.');
    const earliestAvailableId = this.events[0]?.id ?? this.nextId;
    return {
      events: this.events.filter((event) => event.id > id),
      complete: id >= earliestAvailableId - 1,
    };
  }
}
