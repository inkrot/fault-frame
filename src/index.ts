/**
 * FaultFrame - JavaScript library for catching and visualizing server API errors
 * with beautiful and user-friendly overlay
 */

import { FrameworkParser } from './parsers/base';
import { SymfonyParser } from './parsers/symfony';
import { LaravelParser } from './parsers/laravel';
import { ExpressParser } from './parsers/express';
import { UIRenderer } from './ui/renderer';
import { AxiosConnector } from './connectors/axios';
import { FaultFrameLogger } from './utils/logger';
import type { FaultFrameConfig, ParsedError, ErrorResponse } from './types';

export class FaultFrame {
  private static instance: FaultFrame | null = null;
  private config: FaultFrameConfig;
  private parser: FrameworkParser;
  private renderer: UIRenderer;
  private connectors: any[] = [];
  private lastErrorTimestamp: number = 0;
  private lastErrorHash: string = '';

  private constructor(config: FaultFrameConfig) {
    this.config = {
      enabled: true,
      showToast: true,
      autoInstallAxios: true,
      toastDuration: 10000, // Увеличено до 10 секунд для отладки
      ...config,
    };

    // Select parser based on framework
    this.parser = this.createParser(config.framework);
    this.renderer = new UIRenderer(this.config);
  }

  private createParser(framework: string): FrameworkParser {
    switch (framework.toLowerCase()) {
      case 'symfony':
        return new SymfonyParser();
      case 'laravel':
        return new LaravelParser();
      case 'express':
        return new ExpressParser();
      default:
        return new SymfonyParser(); // Default fallback
    }
  }

  /**
   * Initialize FaultFrame library
   */
  public static init(config: FaultFrameConfig): FaultFrame {
    if (!FaultFrame.instance) {
      FaultFrame.instance = new FaultFrame(config);

      // Auto-install global error handlers (disabled by default)
      if (config.captureGlobalErrors === true) {
        FaultFrame.instance.installGlobalHandlers();
      }

      FaultFrameLogger.log('Init', {
        framework: config.framework,
        enabled: FaultFrame.instance.config.enabled,
        hasAxios: !!config.axiosInstance,
      });
    } else {
      // Instance already exists - update config if needed
      FaultFrameLogger.log('Init', 'Instance already exists, updating config');
      FaultFrame.instance.config = {
        ...FaultFrame.instance.config,
        ...config,
      };
    }

    // Auto-install Axios interceptor if enabled (even for existing instance)
    const shouldAutoInstall = config.autoInstallAxios !== false;
    if (shouldAutoInstall && config.axiosInstance) {
      FaultFrame.instance.installAxiosInterceptor(config.axiosInstance);
      FaultFrameLogger.log('Init', 'Axios interceptor installed on new instance');
    }

    return FaultFrame.instance;
  }

  /**
   * Get current instance
   */
  public static getInstance(): FaultFrame | null {
    return FaultFrame.instance;
  }

  /**
   * Install Axios interceptor
   */
  public installAxiosInterceptor(axiosInstance: any): void {
    const connector = new AxiosConnector(axiosInstance, this);
    this.connectors.push(connector);
  }

  /**
   * Install global error handlers
   */
  private installGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      if (this.config.enabled) {
        this.handleError({
          message: event.message,
          stack: event.error?.stack,
          type: 'javascript',
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (this.config.enabled) {
        this.handleError({
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          type: 'promise',
        });
      }
    });
  }

  /**
   * Main error handling method
   */
  public handleError(error: ErrorResponse): void {
    FaultFrameLogger.log('Main', '========================================');
    FaultFrameLogger.log('Main', 'handleError called');
    FaultFrameLogger.log('Main', 'Enabled:', this.config.enabled);
    FaultFrameLogger.log('Main', 'Framework:', this.config.framework);
    FaultFrameLogger.log('Main', 'Input ErrorResponse:', error);
    FaultFrameLogger.log('Main', '========================================');

    if (!this.config.enabled) {
      FaultFrameLogger.log('Main', 'SKIPPED: FaultFrame is disabled');
      return;
    }

    const parsed = this.parser.parse(error);
    FaultFrameLogger.log('Main', 'Parsed result:', parsed);

    // Check for duplicate errors (prevent showing same error twice)
    const errorHash = `${parsed.status}-${parsed.message}-${error.request?.url}`;
    const now = Date.now();

    if (this.lastErrorHash === errorHash && (now - this.lastErrorTimestamp) < 1000) {
      FaultFrameLogger.log('Main', '⚠️ DUPLICATE ERROR DETECTED - Skipping (same error within 1 second)');
      FaultFrameLogger.log('Main', 'Hash:', errorHash);
      return;
    }

    this.lastErrorHash = errorHash;
    this.lastErrorTimestamp = now;
    FaultFrameLogger.log('Main', '✅ New unique error, proceeding...');

    // Check handleOnlyStatusCodes filter
    if (this.config.handleOnlyStatusCodes && this.config.handleOnlyStatusCodes.length > 0) {
      if (!parsed.status || !this.config.handleOnlyStatusCodes.includes(parsed.status)) {
        FaultFrameLogger.log('handleError', `Skipped: status ${parsed.status} not in handleOnlyStatusCodes list`, this.config.handleOnlyStatusCodes);
        return;
      }
    }

    // Check ignoreStatusCodes filter
    if (this.config.ignoreStatusCodes && this.config.ignoreStatusCodes.length > 0) {
      if (parsed.status && this.config.ignoreStatusCodes.includes(parsed.status)) {
        FaultFrameLogger.log('handleError', `Skipped: status ${parsed.status} in ignoreStatusCodes list`, this.config.ignoreStatusCodes);
        return;
      }
    }

    // Apply custom filter if configured
    if (this.config.onError) {
      const shouldDisplay = this.config.onError(parsed);
      FaultFrameLogger.log('handleError', 'onError callback result:', shouldDisplay);
      if (shouldDisplay === false) {
        FaultFrameLogger.log('handleError', 'Skipped: filtered by onError');
        return;
      }
    }

    // Display error
    if (this.config.showToast) {
      FaultFrameLogger.log('handleError', 'Showing toast');
      this.renderer.showToast(parsed);
    }
  }

  /**
   * Manually show error overlay
   */
  public showOverlay(error: ParsedError): void {
    this.renderer.showOverlay(error);
  }

  /**
   * Clear all toasts
   */
  public clearToasts(): void {
    this.renderer.clearToasts();
  }

  /**
   * Enable/disable error catching
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Update configuration
   */
  public configure(config: Partial<FaultFrameConfig>): void {
    this.config = { ...this.config, ...config };
    this.renderer.updateConfig(this.config);
  }

  /**
   * Destroy instance and cleanup
   */
  public destroy(): void {
    this.connectors.forEach(c => c.destroy?.());
    this.connectors = [];
    this.renderer.destroy();
    FaultFrame.instance = null;
  }
}

// Export types and utilities
export * from './types';
export { SymfonyParser, LaravelParser, ExpressParser };
export { UIRenderer };
export { AxiosConnector };
export { FaultFrameLogger };
export { createFetchWithFaultFrame } from './connectors/fetch';
