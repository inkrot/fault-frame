/**
 * Parser for Laravel error responses
 */

import { FrameworkParser } from './base';
import type { ErrorResponse, ParsedError, StackFrame, LaravelErrorResponse } from '../types';

export class LaravelParser extends FrameworkParser {
  parse(error: ErrorResponse): ParsedError {
    const data = error.data;

    if (this.matches(data)) {
      return this.parseLaravelError(data, error);
    }

    return this.parseGenericError(error);
  }

  matches(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      ('exception' in data || 'message' in data) &&
      'file' in data &&
      'line' in data
    );
  }

  private parseLaravelError(data: LaravelErrorResponse, error: ErrorResponse): ParsedError {
    const trace = data.trace?.map(frame => this.convertLaravelFrame(frame)) || [];

    // Use smart extraction first, fallback to Laravel-specific fields
    const extractedMessage = this.extractErrorMessage(data);
    const message = extractedMessage || data.message || 'Unknown error';
    const title = data.exception || extractedMessage || 'Server Error';

    return {
      title,
      message,
      status: error.status,
      errorClass: data.exception,
      trace: [
        {
          file: data.file,
          line: data.line,
          raw: `at ${data.file}:${data.line}`,
        },
        ...trace,
      ],
      request: error.request,
      raw: data,
      framework: 'laravel',
    };
  }

  private convertLaravelFrame(frame: any): StackFrame {
    return {
      file: frame.file || '',
      line: frame.line,
      function: frame.function || '',
      class: frame.class,
      type: frame.type,
      args: frame.args,
      raw: this.formatLaravelFrame(frame),
    };
  }

  private formatLaravelFrame(frame: any): string {
    const parts: string[] = [];

    if (frame.class && frame.function) {
      parts.push(`${frame.class}${frame.type || '::'}${frame.function}`);
    } else if (frame.function) {
      parts.push(frame.function);
    }

    if (frame.file) {
      parts.push(`at ${frame.file}:${frame.line || '?'}`);
    }

    return parts.join(' ') || 'Unknown frame';
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
