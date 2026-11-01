import { AppError } from './app-error.js';

export class QuotaError extends AppError {
  constructor(message = 'The configured quota has been exceeded.') {
    super(429, 'quota_exceeded', message);
    this.name = 'QuotaError';
  }
}
