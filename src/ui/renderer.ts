/**
 * UI Renderer - Beautiful error overlay
 */

import type { ParsedError, FaultFrameConfig } from '../types';
import { styles } from './styles';

export class UIRenderer {
  private config: FaultFrameConfig;
  private toastContainer: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;

  constructor(config: FaultFrameConfig) {
    this.config = config;
  }

  /**
   * Show toast notification
   */
  public showToast(error: ParsedError): void {
    this.ensureToastContainer();
    if (!this.toastContainer) return;

    const toast = this.createToast(error);
    this.toastContainer.appendChild(toast);

    // Auto remove after duration
    const duration = this.config.toastDuration || 5000;
    setTimeout(() => {
      this.hideToast(toast);
    }, duration);
  }

  /**
   * Show detailed overlay
   */
  public showOverlay(error: ParsedError): void {
    this.ensureOverlay();
    if (!this.overlay) return;

    this.overlay.innerHTML = '';
    this.overlay.appendChild(this.createOverlayContent(error));
    this.overlay.classList.add('ff-overlay-visible');
  }

  /**
   * Clear all toasts
   */
  public clearToasts(): void {
    if (this.toastContainer) {
      this.toastContainer.innerHTML = '';
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: FaultFrameConfig): void {
    this.config = config;
  }

  /**
   * Cleanup and remove all UI elements
   */
  public destroy(): void {
    this.toastContainer?.remove();
    this.overlay?.remove();
    this.toastContainer = null;
    this.overlay = null;
  }

  private ensureToastContainer(): void {
    if (this.toastContainer) return;

    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'ff-toast-container';
    this.applyPosition(this.toastContainer);

    document.body.appendChild(this.toastContainer);
    this.injectStyles();
  }

  private ensureOverlay(): void {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'ff-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hideOverlay();
      }
    });

    document.body.appendChild(this.overlay);
    this.injectStyles();
  }

  private hideOverlay(): void {
    if (this.overlay) {
      this.overlay.classList.remove('ff-overlay-visible');
    }
  }

  private hideToast(toast: HTMLElement): void {
    if (toast.parentElement) {
      const position = this.config.toastPosition || 'bottom-right';
      const exitClass = position.includes('left') ? 'ff-toast-exit-left' : 'ff-toast-exit-right';
      toast.classList.add(exitClass);
      setTimeout(() => toast.remove(), 300);
    }
  }

  private createToast(error: ParsedError): HTMLElement {
    const toast = document.createElement('div');
    toast.className = 'ff-toast';

    const icon = document.createElement('div');
    icon.className = 'ff-toast-icon';
    icon.innerHTML = '⚠';

    const content = document.createElement('div');
    content.className = 'ff-toast-content';

    const title = document.createElement('div');
    title.className = 'ff-toast-title';
    title.textContent = error.status ? `[${error.status}] ${error.title}` : error.title;

    const message = document.createElement('div');
    message.className = 'ff-toast-message';
    message.textContent = this.truncate(error.message, 100);

    content.appendChild(title);
    content.appendChild(message);

    toast.appendChild(icon);
    toast.appendChild(content);

    // Click to show overlay and hide toast
    toast.addEventListener('click', () => {
      this.showOverlay(error);
      this.hideToast(toast);
    });

    return toast;
  }

  private createOverlayContent(error: ParsedError): HTMLElement {
    const container = document.createElement('div');
    container.className = 'ff-overlay-content';

    // Fixed header container
    const headerContainer = document.createElement('div');
    headerContainer.className = 'ff-overlay-header';

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'ff-header-buttons';

    // Copy All button
    const copyAllBtn = document.createElement('button');
    copyAllBtn.className = 'ff-copy-all-btn';
    copyAllBtn.innerHTML = '📋 Copy All';
    copyAllBtn.title = 'Copy all error details';
    copyAllBtn.addEventListener('click', async () => {
      try {
        const fullText = this.formatErrorAsText(error);
        await navigator.clipboard.writeText(fullText);
        const originalText = copyAllBtn.innerHTML;
        copyAllBtn.innerHTML = '✓ Copied';
        copyAllBtn.classList.add('ff-copy-success');
        setTimeout(() => {
          copyAllBtn.innerHTML = originalText;
          copyAllBtn.classList.remove('ff-copy-success');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy full error:', err);
      }
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ff-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => this.hideOverlay());

    buttonsContainer.appendChild(copyAllBtn);
    buttonsContainer.appendChild(closeBtn);

    // Header
    const header = document.createElement('div');
    header.className = 'ff-header';

    const statusBadge = document.createElement('span');
    statusBadge.className = 'ff-status-badge';
    statusBadge.textContent = String(error.status || 'Error');

    const title = document.createElement('h1');
    title.className = 'ff-title';
    title.textContent = error.title;

    header.appendChild(statusBadge);
    header.appendChild(title);

    headerContainer.appendChild(buttonsContainer);
    headerContainer.appendChild(header);

    // Scrollable body container
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'ff-overlay-body';

    // Error class
    if (error.errorClass) {
      const classBlock = document.createElement('div');
      classBlock.className = 'ff-error-class';
      classBlock.textContent = `Exception: ${error.errorClass}`;
      bodyContainer.appendChild(classBlock);
    }

    // Message
    const messageBlock = document.createElement('div');
    messageBlock.className = 'ff-message-block';

    const messageLabel = document.createElement('div');
    messageLabel.className = 'ff-label';
    messageLabel.textContent = 'Error Details';

    const messageContainer = document.createElement('div');
    messageContainer.style.position = 'relative';

    const messagePre = document.createElement('pre');
    messagePre.className = 'ff-message';
    messagePre.textContent = error.message;

    const copyMessageBtn = document.createElement('button');
    copyMessageBtn.className = 'ff-copy-message-btn';
    copyMessageBtn.innerHTML = '📋';
    copyMessageBtn.title = 'Copy error details';
    copyMessageBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(error.message);
        copyMessageBtn.innerHTML = '✓';
        copyMessageBtn.classList.add('ff-copy-success');
        setTimeout(() => {
          copyMessageBtn.innerHTML = '📋';
          copyMessageBtn.classList.remove('ff-copy-success');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy error message:', err);
      }
    });

    messageContainer.appendChild(messagePre);
    messageContainer.appendChild(copyMessageBtn);
    messageBlock.appendChild(messageLabel);
    messageBlock.appendChild(messageContainer);
    bodyContainer.appendChild(messageBlock);

    // Request info
    if (error.request) {
      const requestBlock = this.createRequestBlock(error.request);
      bodyContainer.appendChild(requestBlock);
    }

    // Stack trace
    if (error.trace && error.trace.length > 0) {
      const stackBlock = this.createStackTraceBlock(error);
      bodyContainer.appendChild(stackBlock);
    }

    container.appendChild(headerContainer);
    container.appendChild(bodyContainer);

    return container;
  }

  private createRequestBlock(request: any): HTMLElement {
    const block = document.createElement('div');
    block.className = 'ff-request-block';

    // Header with toggle
    const header = document.createElement('div');
    header.className = 'ff-request-header';
    header.style.cursor = 'pointer';
    header.style.userSelect = 'none';

    const label = document.createElement('div');
    label.className = 'ff-label';
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';

    const arrow = document.createElement('span');
    arrow.className = 'ff-request-arrow';
    arrow.textContent = '▶';
    arrow.style.fontSize = '10px';
    arrow.style.transition = 'transform 0.2s';
    arrow.style.display = 'inline-block';

    const labelText = document.createElement('span');
    labelText.textContent = 'Request';

    label.appendChild(arrow);
    label.appendChild(labelText);

    const content = document.createElement('div');
    content.className = 'ff-request-content';

    if (request.method && request.url) {
      const methodBadge = document.createElement('span');
      methodBadge.className = `ff-method-badge ff-method-${request.method.toLowerCase()}`;
      methodBadge.textContent = request.method;

      const url = document.createElement('span');
      url.className = 'ff-url';
      url.textContent = request.url;

      content.appendChild(methodBadge);
      content.appendChild(url);
    }

    header.appendChild(label);
    header.appendChild(content);

    // Collapsible details section
    const details = document.createElement('div');
    details.className = 'ff-request-details';
    details.style.display = 'none';
    details.style.marginTop = '12px';
    details.style.paddingLeft = '20px';

    // Headers section
    if (request.headers && Object.keys(request.headers).length > 0) {
      const headersSection = document.createElement('div');
      headersSection.className = 'ff-request-section';
      headersSection.style.marginBottom = '12px';

      const headersLabel = document.createElement('div');
      headersLabel.className = 'ff-sublabel';
      headersLabel.textContent = 'Headers:';
      headersLabel.style.color = '#61afef';
      headersLabel.style.marginBottom = '4px';
      headersLabel.style.fontSize = '13px';

      const headersPre = document.createElement('pre');
      headersPre.className = 'ff-code-block';
      headersPre.style.fontSize = '12px';
      headersPre.textContent = JSON.stringify(request.headers, null, 2);

      headersSection.appendChild(headersLabel);
      headersSection.appendChild(headersPre);
      details.appendChild(headersSection);
    }

    // Body section (если есть)
    if (request.body !== undefined && request.body !== null) {
      const bodySection = document.createElement('div');
      bodySection.className = 'ff-request-section';

      const bodyLabel = document.createElement('div');
      bodyLabel.className = 'ff-sublabel';
      bodyLabel.textContent = 'Body:';
      bodyLabel.style.color = '#61afef';
      bodyLabel.style.marginBottom = '4px';
      bodyLabel.style.fontSize = '13px';

      const bodyPre = document.createElement('pre');
      bodyPre.className = 'ff-code-block';
      bodyPre.style.fontSize = '12px';

      // Format body based on type
      if (typeof request.body === 'string') {
        try {
          const parsed = JSON.parse(request.body);
          bodyPre.textContent = JSON.stringify(parsed, null, 2);
        } catch {
          bodyPre.textContent = request.body;
        }
      } else if (request.body instanceof FormData) {
        bodyPre.textContent = '[FormData - multipart/form-data]';
      } else {
        bodyPre.textContent = JSON.stringify(request.body, null, 2);
      }

      bodySection.appendChild(bodyLabel);
      bodySection.appendChild(bodyPre);
      details.appendChild(bodySection);
    }

    // Toggle functionality
    let isExpanded = false;
    header.addEventListener('click', () => {
      isExpanded = !isExpanded;
      details.style.display = isExpanded ? 'block' : 'none';
      arrow.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    block.appendChild(header);
    block.appendChild(details);

    return block;
  }

  private createStackTraceBlock(error: ParsedError): HTMLElement {
    const block = document.createElement('div');
    block.className = 'ff-stack-block';

    const label = document.createElement('div');
    label.className = 'ff-label';
    label.textContent = 'Stack Trace';

    const stack = document.createElement('div');
    stack.className = 'ff-stack-trace';

    const maxLines = this.config.maxStackLines || 20;
    const frames = error.trace!.slice(0, maxLines);

    frames.forEach((frame, index) => {
      const frameEl = this.createStackFrame(frame, index);
      stack.appendChild(frameEl);
    });

    block.appendChild(label);
    block.appendChild(stack);

    return block;
  }

  private createStackFrame(frame: any, index: number): HTMLElement {
    const frameEl = document.createElement('div');
    frameEl.className = 'ff-stack-frame';

    const number = document.createElement('span');
    number.className = 'ff-frame-number';
    number.textContent = String(index);

    const content = document.createElement('div');
    content.className = 'ff-frame-content';

    // Function/class name
    if (frame.class || frame.function) {
      const func = document.createElement('div');
      func.className = 'ff-frame-function';

      if (frame.class) {
        const className = document.createElement('span');
        className.className = 'ff-class-name';
        className.textContent = frame.class;
        func.appendChild(className);

        if (frame.type) {
          const type = document.createElement('span');
          type.className = 'ff-method-type';
          type.textContent = frame.type;
          func.appendChild(type);
        }
      }

      if (frame.function) {
        const funcName = document.createElement('span');
        funcName.className = 'ff-function-name';
        funcName.textContent = frame.function + '()';
        func.appendChild(funcName);
      }

      content.appendChild(func);
    }

    // File location
    if (frame.file) {
      const locationContainer = document.createElement('div');
      locationContainer.className = 'ff-frame-location-container';

      const location = document.createElement('div');
      location.className = 'ff-frame-location';

      const file = this.shortenPath(frame.file);
      location.textContent = `${file}${frame.line ? ':' + frame.line : ''}`;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'ff-copy-path-btn';
      copyBtn.innerHTML = '📋';
      copyBtn.title = 'Copy path';

      const pathToCopy = this.stripPathPrefix(frame.file);
      const fullPath = `${pathToCopy}${frame.line ? ':' + frame.line : ''}`;
      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(fullPath);
          copyBtn.innerHTML = '✓';
          copyBtn.classList.add('ff-copy-success');
          setTimeout(() => {
            copyBtn.innerHTML = '📋';
            copyBtn.classList.remove('ff-copy-success');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy path:', err);
        }
      });

      locationContainer.appendChild(location);
      locationContainer.appendChild(copyBtn);
      content.appendChild(locationContainer);
    }

    frameEl.appendChild(number);
    frameEl.appendChild(content);

    return frameEl;
  }

  private formatErrorAsText(error: ParsedError): string {
    let text = '';

    // Title and status
    text += `ERROR: ${error.status ? `[${error.status}] ` : ''}${error.title}\n`;
    text += '='.repeat(60) + '\n\n';

    // Exception class
    if (error.errorClass) {
      text += `Exception: ${error.errorClass}\n\n`;
    }

    // Request info
    if (error.request) {
      text += 'REQUEST:\n';
      if (error.request.method && error.request.url) {
        text += `${error.request.method} ${error.request.url}\n`;
      }

      if (error.request.headers && Object.keys(error.request.headers).length > 0) {
        text += '\nHeaders:\n';
        Object.entries(error.request.headers).forEach(([key, value]) => {
          text += `  ${key}: ${value}\n`;
        });
      }

      if (error.request.body !== undefined && error.request.body !== null) {
        text += '\nBody:\n';
        if (typeof error.request.body === 'string') {
          try {
            const parsed = JSON.parse(error.request.body);
            text += JSON.stringify(parsed, null, 2);
          } catch {
            text += error.request.body;
          }
        } else if (error.request.body instanceof FormData) {
          text += '[FormData - multipart/form-data]';
        } else {
          text += JSON.stringify(error.request.body, null, 2);
        }
        text += '\n';
      }
      text += '\n';
    }

    // Error details
    text += 'ERROR DETAILS:\n';
    text += error.message + '\n\n';

    // Stack trace
    if (error.trace && error.trace.length > 0) {
      text += 'STACK TRACE:\n';
      const maxLines = this.config.maxStackLines || 20;
      const frames = error.trace.slice(0, maxLines);

      frames.forEach((frame, index) => {
        text += `${index}. `;

        if (frame.class || frame.function) {
          if (frame.class) {
            text += frame.class;
            if (frame.type) {
              text += frame.type;
            }
          }
          if (frame.function) {
            text += frame.function + '()';
          }
          text += '\n   ';
        }

        if (frame.file) {
          const pathToCopy = this.stripPathPrefix(frame.file);
          text += `at ${pathToCopy}${frame.line ? ':' + frame.line : ''}`;
        }

        text += '\n';
      });
    }

    return text;
  }

  private stripPathPrefix(path: string): string {
    const prefix = this.config.stripPathPrefix;
    if (!prefix) {
      return path;
    }

    // Normalize slashes for comparison
    const normalizedPath = path.replace(/\\/g, '/');
    const normalizedPrefix = prefix.replace(/\\/g, '/');

    if (normalizedPath.startsWith(normalizedPrefix)) {
      return normalizedPath.substring(normalizedPrefix.length);
    }

    return path;
  }

  private shortenPath(path: string): string {
    const parts = path.split(/[/\\]/);
    if (parts.length > 3) {
      return '.../' + parts.slice(-3).join('/');
    }
    return path;
  }

  private truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  private applyPosition(element: HTMLElement): void {
    const position = this.config.toastPosition || 'bottom-right';
    element.className = `ff-toast-container ff-position-${position}`;
  }

  private injectStyles(): void {
    if (document.getElementById('ff-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'ff-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}
