export interface RemoteCodeSandbox {
    execute(code: string, options: {
        signal: AbortSignal;
        networkAccess: false;
    }): Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
    }>;
}
export declare function createCodeInterpreterTool(sandbox?: RemoteCodeSandbox): import("./tool-registry.js").AiTool;
