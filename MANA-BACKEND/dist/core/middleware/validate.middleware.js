export function validateRequest(input) {
    return (request, response, next) => {
        try {
            response.locals.validated = {
                ...(input.body ? { body: input.body.parse(request.body) } : {}),
                ...(input.query ? { query: input.query.parse(request.query) } : {}),
                ...(input.params ? { params: input.params.parse(request.params) } : {}),
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map