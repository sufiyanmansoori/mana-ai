export declare function createCsrfToken(): string;
export declare function verifyCsrfToken(cookieToken: string | undefined, submittedToken: string | undefined): boolean;
