/**
 * Parser for Symfony error responses
 */

import { FrameworkParser } from './base';
import type { ErrorResponse, ParsedError, StackFrame, SymfonyErrorResponse } from '../types';

export class SymfonyParser extends FrameworkParser {
  parse(error: ErrorResponse): ParsedError {
    const data = error.data;

    // Check if it's Symfony format
    if (this.matches(data)) {
      return this.parseSymfonyError(data, error);
    }

    // Fallback to generic parsing
    return this.parseGenericError(error);
  }

  matches(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'type' in data &&
      'title' in data &&
      'status' in data &&
      'class' in data
    );
  }

  private parseSymfonyError(data: SymfonyErrorResponse, error: ErrorResponse): ParsedError {
    const trace = data.trace?.map(frame => this.convertSymfonyFrame(frame)) || [];

    // Try smart extraction first, fallback to Symfony-specific fields
    const extractedMessage = this.extractErrorMessage(data);
    const message = extractedMessage || data.detail || data.title || 'Unknown error';
    const title = data.title || extractedMessage || 'Server Error';

    return {
      title,
      message,
      status: data.status,
      errorClass: data.class,
      trace,
      request: error.request,
      raw: data,
      framework: 'symfony',
    };
  }

  private convertSymfonyFrame(frame: any): StackFrame {
    return {
      file: frame.file || '',
      line: frame.line,
      function: frame.function || '',
      class: frame.class || '',
      namespace: frame.namespace || '',
      type: frame.type || '',
      args: frame.args || [],
      raw: this.formatSymfonyFrame(frame),
    };
  }

  private formatSymfonyFrame(frame: any): string {
    const parts: string[] = [];

    if (frame.class) {
      parts.push(frame.class + (frame.type || '->') + frame.function);
    } else if (frame.function) {
      parts.push(frame.function);
    }

    if (frame.file) {
      parts.push(`at ${frame.file}:${frame.line || '?'}`);
    }

    return parts.join(' ') || 'Unknown frame';
  }

  private parseGenericError(error: ErrorResponse): ParsedError {
    let trace: StackFrame[] = [];

    if (error.stack) {
      trace = this.parseStackString(error.stack);
    }

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
