export interface RequestContext {
    requestId: string;
    subject?: string;
}
export declare function runWithRequestContext<T>(value: Partial<RequestContext>, operation: () => T): T;
export declare function getRequestContext(): RequestContext | undefined;
