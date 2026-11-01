export interface WeightedRoute<T> {
    value: T;
    weight: number;
    enabled?: boolean;
}
export declare function createWeightedLoadBalancer<T>(routes: readonly WeightedRoute<T>[]): () => T;
