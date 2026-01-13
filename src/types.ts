/**
 * Type definitions for FaultFrame library
 */

export interface FaultFrameConfig {
  /** Backend framework type */
  framework: 'symfony' | 'laravel' | 'express' | string;

  /** Axios instance for auto-interceptor */
  axiosInstance?: any;

  /** Enable/disable error catching */
  enabled?: boolean;

  /** Show toast notifications */
  showToast?: boolean;

  /** Auto-install axios interceptor (default: true) */
  autoInstallAxios?: boolean;

  /** Capture global JavaScript errors and unhandled promise rejections (default: false). Not recommended - use Axios interceptor instead. */
  captureGlobalErrors?: boolean;

  /** Custom error filter/handler */
  onError?: (error: ParsedError) => boolean | void;

  /** Only handle errors with these status codes (if set, all other errors are ignored) */
  handleOnlyStatusCodes?: number[];

  /** Ignore errors with these status codes */
  ignoreStatusCodes?: number[];

  /** UI customization */
  theme?: 'dark' | 'light';
  toastPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  toastDuration?: number;

  /** Stack trace formatting */
  maxStackLines?: number;
  filterStackTrace?: (line: StackFrame) => boolean;

  /** Path prefix to strip when copying file paths (e.g., '/var/www/app/' -> 'src/...') */
  stripPathPrefix?: string;
}

export interface ErrorResponse {
  /** HTTP status code */
  status?: number;

  /** HTTP status text */
  statusText?: string;

  /** Error message */
  message?: string;

  /** Error data from server */
  data?: any;

  /** Stack trace */
  stack?: string;

  /** Error type */
  type?: string;

  /** Request info */
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  };
}

export interface ParsedError {
  /** Error title */
  title: string;

  /** Error message/detail */
  message: string;

  /** HTTP status code */
  status?: number;

  /** Error class/type */
  errorClass?: string;

  /** Stack trace frames */
  trace?: StackFrame[];

  /** Request information */
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  };

  /** Original error data */
  raw?: any;

  /** Framework type */
  framework?: string;
}

export interface StackFrame {
  /** File path */
  file: string;

  /** Line number */
  line?: number;

  /** Column number */
  column?: number;

  /** Function name */
  function?: string;

  /** Class name */
  class?: string;

  /** Namespace */
  namespace?: string;

  /** Method type (-> or ::) */
  type?: string;

  /** Function arguments */
  args?: any[];

  /** Full frame text */
  raw?: string;
}

export interface SymfonyErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  class: string;
  trace: SymfonyStackFrame[];
}

export interface SymfonyStackFrame {
  namespace: string;
  short_class: string;
  class: string;
  type: string;
  function: string;
  file: string;
  line: number;
  args: any[];
}

export interface LaravelErrorResponse {
  message: string;
  exception: string;
  file: string;
  line: number;
  trace: LaravelStackFrame[];
}

export interface LaravelStackFrame {
  file: string;
  line: number;
  function: string;
  class?: string;
  type?: string;
  args?: any[];
}

export interface ExpressErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  stack?: string;
}
