import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validateRequest(input: {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}): RequestHandler {
  return (request, response, next) => {
    try {
      response.locals.validated = {
        ...(input.body ? { body: input.body.parse(request.body) } : {}),
        ...(input.query ? { query: input.query.parse(request.query) } : {}),
        ...(input.params ? { params: input.params.parse(request.params) } : {}),
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
