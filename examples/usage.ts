/**
 * Examples of FaultFrame usage
 */

import axios from 'axios';
import { FaultFrame } from '../index';

// ============================================
// Example 1: Basic Setup
// ============================================

const api = axios.create({
  baseURL: 'https://api.example.com',
});

FaultFrame.init({
  framework: 'symfony',
  axiosInstance: api,
});

// ============================================
// Example 2: Status Code Filtering
// ============================================

// Only show server errors (5xx)
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: api,
  handleOnlyStatusCodes: [500, 502, 503, 504],
});

// Ignore auth and not found errors
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: api,
  ignoreStatusCodes: [401, 404],
});

// ============================================
// Example 3: Advanced Configuration
// ============================================

FaultFrame.init({
  framework: 'symfony',
  axiosInstance: api,
  enabled: import.meta.env.DEV,
  toastPosition: 'bottom-right',
  toastDuration: 5000,
  maxStackLines: 20,

  // Ignore auth errors
  ignoreStatusCodes: [401, 403],

  // Strip Docker path prefix
  stripPathPrefix: '/var/www/app/',

  // Custom error filter (runs after status code filters)
  onError: (error) => {
    // Log to analytics
    console.error('API Error:', error);
    return true;
  },

  // Filter vendor files from stack trace
  filterStackTrace: (frame) => {
    return !frame.file.includes('/vendor/');
  },
});

// ============================================
// Example 4: Manual Error Handling
// ============================================

const faultFrame = FaultFrame.getInstance();

try {
  // Some code that might throw
  throw new Error('Something went wrong');
} catch (error: any) {
  faultFrame?.handleError({
    message: error.message,
    stack: error.stack,
  });
}

// ============================================
// Example 5: Programmatic Control
// ============================================

// Disable in production
if (import.meta.env.PROD) {
  faultFrame?.setEnabled(false);
}

// Clear all toasts
faultFrame?.clearToasts();

// Update configuration
faultFrame?.configure({
  toastDuration: 7000,
  maxStackLines: 30,
});

// ============================================
// Example 5: Show Custom Overlay
// ============================================

faultFrame?.showOverlay({
  title: 'Custom Error',
  message: 'This is a custom error message',
  status: 500,
  errorClass: 'CustomException',
  trace: [
    {
      file: '/app/src/Service/MyService.ts',
      line: 42,
      function: 'doSomething',
      class: 'MyService',
      type: '->',
    },
  ],
});

// ============================================
// Example 6: React Integration
// ============================================

// src/api/client.ts
import axios from 'axios';
import { FaultFrame } from '@/api/fault-frame';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

FaultFrame.init({
  framework: 'symfony',
  axiosInstance: apiClient,
  enabled: import.meta.env.DEV,
});

// src/hooks/useApi.ts
import { apiClient } from '@/api/client';

export function useApi() {
  const get = async (url: string) => {
    const response = await apiClient.get(url);
    return response.data;
  };

  const post = async (url: string, data: any) => {
    const response = await apiClient.post(url, data);
    return response.data;
  };

  return { get, post };
}

// ============================================
// Example 7: Environment-Specific Setup
// ============================================

const config = {
  framework: 'symfony' as const,
  axiosInstance: api,
};

if (import.meta.env.DEV) {
  // Development: show all errors
  FaultFrame.init({
    ...config,
    enabled: true,
    toastPosition: 'bottom-right',
  });
} else if (import.meta.env.STAGING) {
  // Staging: show errors but log to service
  FaultFrame.init({
    ...config,
    enabled: true,
    onError: (error) => {
      // Log to error tracking service
      // sendToSentry(error);
      return true;
    },
  });
} else {
  // Production: only log, don't show
  FaultFrame.init({
    ...config,
    enabled: false,
    onError: (error) => {
      // sendToSentry(error);
      return false;
    },
  });
}

// ============================================
// Example 8: Multiple Axios Instances
// ============================================

const apiV1 = axios.create({ baseURL: '/api/v1' });
const apiV2 = axios.create({ baseURL: '/api/v2' });

// First initialization
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: apiV1,
});

// Second initialization - interceptor will be added to apiV2
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: apiV2,
});

// Now both apiV1 and apiV2 have interceptors installed!

// Alternative: use installAxiosInterceptor method
const faultFrame = FaultFrame.getInstance();
faultFrame?.installAxiosInterceptor(apiV2);

// ============================================
// Example 9: Fetch API Support
// ============================================

import { createFetchWithFaultFrame } from '../index';

// Create wrapper function
const faultFrame = FaultFrame.getInstance();
const fetchWithErrors = createFetchWithFaultFrame(faultFrame);

// Use like normal fetch
async function fetchExample() {
  try {
    const response = await fetchWithErrors('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'John' }),
    });

    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    // Network errors or exceptions
    console.error('Request failed:', error);
  }
}

// Or create during initialization
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: api,
});

const myFetch = createFetchWithFaultFrame(FaultFrame.getInstance());

// ============================================
// Example 10: Cleanup
// ============================================

// Component unmount or app shutdown
const cleanup = () => {
  const faultFrame = FaultFrame.getInstance();
  faultFrame?.destroy();
};

// In React
// useEffect(() => {
//   return () => cleanup();
// }, []);

// ============================================
// Example 10: Testing
// ============================================

// Disable FaultFrame during tests
if (import.meta.env.MODE === 'test') {
  FaultFrame.init({
    framework: 'symfony',
    axiosInstance: api,
    enabled: false,
    showToast: false,
  });
}
