/**
 * Fetch API wrapper for automatic error handling
 */

import type { FaultFrame } from '../index';
import type { ErrorResponse } from '../types';
import { FaultFrameLogger } from '../utils/logger';

/**
 * Wrapper around fetch that automatically handles errors with FaultFrame
 *
 * @example
 * ```typescript
 * import { createFetchWithFaultFrame } from 'fault-frame';
 *
 * const faultFrame = FaultFrame.getInstance();
 * const fetchWithErrors = createFetchWithFaultFrame(faultFrame);
 *
 * // Use like normal fetch
 * const response = await fetchWithErrors('/api/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John' })
 * });
 * ```
 */
export function createFetchWithFaultFrame(faultFrame: FaultFrame | null) {
  return async function fetchWithFaultFrame(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    FaultFrameLogger.log('Fetch', 'Request started:', input);

    try {
      const response = await fetch(input, init);

      // Check if response is not OK (status >= 400)
      if (!response.ok) {
        FaultFrameLogger.log('Fetch', '========================================');
        FaultFrameLogger.log('Fetch', 'Intercepted error response');
        FaultFrameLogger.log('Fetch', 'Status:', response.status);
        FaultFrameLogger.log('Fetch', 'Status Text:', response.statusText);

        // Parse response body
        let data: any;
        const contentType = response.headers.get('content-type');

        try {
          if (contentType?.includes('application/json')) {
            // Clone response to avoid consuming body
            data = await response.clone().json();
            FaultFrameLogger.log('Fetch', 'Response Data (JSON):', data);
          } else if (contentType?.includes('text/')) {
            data = await response.clone().text();
            FaultFrameLogger.log('Fetch', 'Response Data (Text):', data);
          } else {
            data = null;
            FaultFrameLogger.log('Fetch', 'Response Data: [Binary/Unknown]');
          }
        } catch (parseError) {
          FaultFrameLogger.log('Fetch', 'Failed to parse response body:', parseError);
          data = null;
        }

        // Extract request info
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        const method = init?.method || 'GET';
        const headers: Record<string, string> = {};

        // Convert Headers to plain object
        if (init?.headers) {
          if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
              headers[key] = value;
            });
          } else if (Array.isArray(init.headers)) {
            init.headers.forEach(([key, value]) => {
              headers[key] = value;
            });
          } else {
            Object.assign(headers, init.headers);
          }
        }

        const errorResponse: ErrorResponse = {
          status: response.status,
          statusText: response.statusText,
          message: `Request failed with status code ${response.status}`,
          data,
          request: {
            method: method.toUpperCase(),
            url,
            headers,
            body: init?.body,
          },
        };

        FaultFrameLogger.log('Fetch', 'Formatted ErrorResponse object:', errorResponse);
        FaultFrameLogger.log('Fetch', '========================================');

        // Handle error through FaultFrame
        if (faultFrame) {
          faultFrame.handleError(errorResponse);
        } else {
          FaultFrameLogger.warn('Fetch', 'FaultFrame instance not found');
        }
      }

      return response;
    } catch (error) {
      // Network error or other exception
      FaultFrameLogger.log('Fetch', '========================================');
      FaultFrameLogger.log('Fetch', 'Network or other error');
      FaultFrameLogger.log('Fetch', 'Error:', error);
      FaultFrameLogger.log('Fetch', '========================================');

      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      const errorResponse: ErrorResponse = {
        status: 0,
        statusText: 'Network Error',
        message: error instanceof Error ? error.message : 'Network request failed',
        data: null,
        request: {
          method: (init?.method || 'GET').toUpperCase(),
          url,
          headers: init?.headers as any,
          body: init?.body,
        },
      };

      if (faultFrame) {
        faultFrame.handleError(errorResponse);
      }

      // Re-throw the error so caller can handle it
      throw error;
    }
  };
}
