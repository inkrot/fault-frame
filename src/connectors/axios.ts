/**
 * Axios connector for automatic error interception
 */

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { FaultFrame } from '../index';
import type { ErrorResponse } from '../types';
import { FaultFrameLogger } from '../utils/logger';

export class AxiosConnector {
  private axios: AxiosInstance;
  private faultFrame: FaultFrame;
  private interceptorId: number | null = null;

  constructor(axiosInstance: AxiosInstance, faultFrame: FaultFrame) {
    this.axios = axiosInstance;
    this.faultFrame = faultFrame;
    this.install();
  }

  /**
   * Install axios response interceptor
   */
  private install(): void {
    this.interceptorId = this.axios.interceptors.response.use(
      // Success handler - pass through
      (response: any) => response,

      // Error handler - catch and display
      (error: AxiosError) => {
        FaultFrameLogger.log('Axios', '=========== Intercepted error', error);
        this.handleAxiosError(error);
        return Promise.reject(error);
      }
    );
    FaultFrameLogger.log('Axios', 'Interceptor installed, ID:', this.interceptorId);
  }

  /**
   * Handle Axios error
   */
  private handleAxiosError(error: AxiosError): void {
    FaultFrameLogger.log('Axios', '========================================');
    FaultFrameLogger.log('Axios', 'Intercepted error');
    FaultFrameLogger.log('Axios', 'Status:', error.response?.status);
    FaultFrameLogger.log('Axios', 'Status Text:', error.response?.statusText);
    FaultFrameLogger.log('Axios', 'Axios Message:', error.message);
    FaultFrameLogger.log('Axios', 'Response Data:', error.response?.data);
    FaultFrameLogger.log('Axios', '========================================');

    const errorResponse: ErrorResponse = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      request: {
        method: (error.config as InternalAxiosRequestConfig)?.method?.toUpperCase(),
        url: this.getFullUrl(error.config as InternalAxiosRequestConfig),
        headers: (error.config as InternalAxiosRequestConfig)?.headers as any,
        body: (error.config as InternalAxiosRequestConfig)?.data,
      },
    };

    FaultFrameLogger.log('Axios', 'Formatted ErrorResponse object:', errorResponse);

    // Handle error through FaultFrame
    this.faultFrame.handleError(errorResponse);
  }

  /**
   * Get full URL from Axios config
   */
  private getFullUrl(config?: InternalAxiosRequestConfig): string {
    if (!config) return '';

    const baseURL = config.baseURL || '';
    const url = config.url || '';

    // Combine baseURL and url
    if (baseURL && url) {
      // Remove trailing slash from baseURL and leading slash from url
      const cleanBase = baseURL.replace(/\/$/, '');
      const cleanUrl = url.replace(/^\//, '');
      return `${cleanBase}/${cleanUrl}`;
    }

    return baseURL + url;
  }

  /**
   * Remove interceptor and cleanup
   */
  public destroy(): void {
    if (this.interceptorId !== null) {
      this.axios.interceptors.response.eject(this.interceptorId);
      this.interceptorId = null;
    }
  }
}
