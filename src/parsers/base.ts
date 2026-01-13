/**
 * Base parser for error responses
 */

import type { ErrorResponse, ParsedError, StackFrame } from '../types';

/**
 * Common field names for error messages in various API formats
 */
const ERROR_MESSAGE_FIELDS = [
  'error',
  'message',
  'errorMessage',
  'error_message',
  'errorText',
  'error_text',
  'msg',
  'detail',
  'description',
  'reason',
  'errorDescription',
  'error_description',
];

export abstract class FrameworkParser {
  /**
   * Parse error response into unified format
   */
  abstract parse(error: ErrorResponse): ParsedError;

  /**
   * Check if response matches this parser's format
   */
  abstract matches(data: any): boolean;

  /**
   * Parse stack trace from string
   */
  protected parseStackString(stack: string): StackFrame[] {
    if (!stack) return [];

    const frames: StackFrame[] = [];
    const lines = stack.split('\n');

    for (const line of lines) {
      const frame = this.parseStackLine(line.trim());
      if (frame) {
        frames.push(frame);
      }
    }

    return frames;
  }

  /**
   * Parse single stack trace line
   */
  protected parseStackLine(line: string): StackFrame | null {
    if (!line) return null;

    // Match different stack trace formats
    // Format: "at FunctionName (file.js:10:5)"
    const match1 = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (match1) {
      return {
        function: match1[1],
        file: match1[2],
        line: parseInt(match1[3]),
        column: parseInt(match1[4]),
        raw: line,
      };
    }

    // Format: "at file.js:10:5"
    const match2 = line.match(/at\s+(.+?):(\d+):(\d+)/);
    if (match2) {
      return {
        file: match2[1],
        line: parseInt(match2[2]),
        column: parseInt(match2[3]),
        raw: line,
      };
    }

    return {
      raw: line,
      file: '',
    };
  }

  /**
   * Format error for display
   */
  protected formatError(title: string, message: string, status?: number): string {
    let formatted = title;
    if (status) {
      formatted = `[${status}] ${formatted}`;
    }
    if (message && message !== title) {
      formatted += `\n${message}`;
    }
    return formatted;
  }

  /**
   * Extract error message from data object by checking common field names
   */
  protected extractErrorMessage(data: any): string | null {
    if (!data || typeof data !== 'object') {
      return typeof data === 'string' ? data : null;
    }

    // Try each common field name
    for (const field of ERROR_MESSAGE_FIELDS) {
      if (field in data && data[field]) {
        const value = data[field];
        if (typeof value === 'string') {
          return value;
        }
        // Handle nested objects
        if (typeof value === 'object' && value.message) {
          return value.message;
        }
      }
    }

    return null;
  }

  /**
   * Check if data has error message but no stack trace (simple error response)
   */
  protected isSimpleErrorResponse(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Has error message field
    const hasErrorMessage = ERROR_MESSAGE_FIELDS.some(field => field in data);

    // But no stack trace
    const hasNoTrace = !('trace' in data) &&
                       !('stack' in data) &&
                       !('file' in data) &&
                       !('class' in data) &&
                       !('exception' in data);

    return hasErrorMessage && hasNoTrace;
  }
}
