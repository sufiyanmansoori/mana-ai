import { AppError } from './app-error.js';

export class ValidationError extends AppError {
  constructor(message = 'The request contains invalid fields.') {
    super(400, 'validation_error', message);
    this.name = 'ValidationError';
  }
}
