export type CacheWarmup = () => void | Promise<void>;
export declare class CacheWarmupRegistry {
    private readonly tasks;
    private started;
    register(name: string, warmup: CacheWarmup): void;
    run(): Promise<void>;
}
