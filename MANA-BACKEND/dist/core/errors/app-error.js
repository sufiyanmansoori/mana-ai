export class AppError extends Error {
    status;
    code;
    constructor(status, code, message, options) {
        super(message, options);
        this.status = status;
        this.code = code;
        this.name = 'AppError';
    }
}
//# sourceMappingURL=app-error.js.map