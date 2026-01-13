/**
 * Parser for Express/Node.js error responses
 */

import { FrameworkParser } from './base';
import type { ErrorResponse, ParsedError, StackFrame, ExpressErrorResponse } from '../types';

export class ExpressParser extends FrameworkParser {
  parse(error: ErrorResponse): ParsedError {
    if (this.matches(error.data)) {
      return this.parseExpressError(error.data, error);
    }

    return this.parseGenericError(error);
  }

  matches(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      ('error' in data || 'message' in data) &&
      !('class' in data) // Not Symfony
    );
  }

  private parseExpressError(data: ExpressErrorResponse, error: ErrorResponse): ParsedError {
    // Use smart field detection for error message
    const extractedMessage = this.extractErrorMessage(data);
    const message = extractedMessage || error.message || 'Unknown error';
    const trace = data.stack ? this.parseStackString(data.stack) : [];

    // Use extracted message as title if available
    const title = extractedMessage || data.error || error.statusText || 'Server Error';

    return {
      title,
      message,
      status: data.statusCode || error.status,
      trace,
      request: error.request,
      raw: data,
      framework: 'express',
    };
  }

  private parseGenericError(error: ErrorResponse): ParsedError {
    const trace = error.stack ? this.parseStackString(error.stack) : [];

    // PRIORITY 1: Try to extract from response.data (most important - server response)
    let message = 'Unknown error';
    let title = error.statusText || 'Error';

    if (error.data) {
      const extractedMessage = this.extractErrorMessage(error.data);
      if (extractedMessage) {
        message = extractedMessage;
        title = extractedMessage; // Use as title too for simple errors
      }
    }

    // PRIORITY 2: Fallback to Axios error message only if nothing found
    if (message === 'Unknown error' && error.message) {
      message = error.message;
    }

    return {
      title,
      message,
      status: error.status,
      trace,
      request: error.request,
      raw: error.data,
      framework: 'generic',
    };
  }
}
