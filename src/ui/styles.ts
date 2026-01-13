/**
 * CSS for FaultFrame overlay and toasts
 */

export const styles = `
/* Toast Container */
.ff-toast-container {
  position: fixed;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.ff-toast-container > * {
  pointer-events: auto;
}

/* Position variants */
.ff-position-top-left {
  top: 20px;
  left: 20px;
}

.ff-position-top-right {
  top: 20px;
  right: 20px;
}

.ff-position-bottom-left {
  bottom: 20px;
  left: 20px;
}

.ff-position-bottom-right {
  bottom: 20px;
  right: 20px;
}

/* Toast */
.ff-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: linear-gradient(135deg, #b52e31 0%, #dc3545 100%);
  color: white;
  padding: 14px 16px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ff-position-top-right .ff-toast,
.ff-position-bottom-right .ff-toast {
  animation: ff-toast-in-right 0.3s ease-out;
}

.ff-position-top-left .ff-toast,
.ff-position-bottom-left .ff-toast {
  animation: ff-toast-in-left 0.3s ease-out;
}

.ff-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.ff-toast-exit-right {
  animation: ff-toast-out-right 0.3s ease-in forwards;
}

.ff-toast-exit-left {
  animation: ff-toast-out-left 0.3s ease-in forwards;
}

@keyframes ff-toast-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes ff-toast-in-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes ff-toast-out-right {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes ff-toast-out-left {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

.ff-toast-icon {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}

.ff-toast-content {
  flex: 1;
  min-width: 0;
}

.ff-toast-title {
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ff-toast-message {
  font-size: 13px;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Overlay */
.ff-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999998;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  animation: ff-overlay-in 0.2s ease-out;
}

.ff-overlay-visible {
  display: flex;
}

@keyframes ff-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Overlay Content */
.ff-overlay-content {
  background: #1a1a1a;
  color: #d4d4d4;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  animation: ff-content-in 0.3s ease-out;
  overflow: hidden;
}

@keyframes ff-content-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Fixed Header Container */
.ff-overlay-header {
  flex-shrink: 0;
  padding: 24px 24px 0 24px;
  background: #1a1a1a;
  border-radius: 12px 12px 0 0;
  position: relative;
}

/* Header buttons container */
.ff-header-buttons {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 1;
}

/* Copy All button */
.ff-copy-all-btn {
  padding: 6px 12px;
  border: none;
  background: rgba(97, 175, 239, 0.2);
  color: #61afef;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ff-copy-all-btn:hover {
  background: rgba(97, 175, 239, 0.3);
  transform: translateY(-1px);
}

.ff-copy-all-btn.ff-copy-success {
  background: rgba(152, 195, 121, 0.2);
  color: #98c379;
}

/* Close button */
.ff-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ff-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Header */
.ff-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Scrollable Body */
.ff-overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px 24px;
}

.ff-status-badge {
  background: linear-gradient(135deg, #b52e31 0%, #dc3545 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ff-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #e06c75;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Error class */
.ff-error-class {
  background: rgba(224, 108, 117, 0.1);
  color: #e06c75;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  border-left: 3px solid #e06c75;
}

/* Message block */
.ff-message-block,
.ff-request-block,
.ff-stack-block {
  margin-bottom: 20px;
}

.ff-label {
  font-size: 12px;
  font-weight: 600;
  color: #61afef;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ff-message {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid #e5c07b;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e5c07b;
}

.ff-copy-message-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #abb2bf;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.ff-message-block:hover .ff-copy-message-btn {
  opacity: 1;
}

.ff-copy-message-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.ff-copy-message-btn.ff-copy-success {
  background: rgba(152, 195, 121, 0.2);
  color: #98c379;
}

/* Request block */
.ff-request-header {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
  padding: 4px;
  margin: -4px;
  border-radius: 6px;
}

.ff-request-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.ff-request-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 16px;
  border-radius: 8px;
  margin-left: 8px;
  flex: 1;
}

.ff-request-details {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ff-code-block {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 0;
  color: #abb2bf;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;
}

.ff-method-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ff-method-get {
  background: #61afef;
  color: #1a1a1a;
}

.ff-method-post {
  background: #98c379;
  color: #1a1a1a;
}

.ff-method-put {
  background: #e5c07b;
  color: #1a1a1a;
}

.ff-method-delete {
  background: #e06c75;
  color: white;
}

.ff-method-patch {
  background: #c678dd;
  color: white;
}

.ff-url {
  color: #56b6c2;
  font-size: 13px;
  word-break: break-all;
}

/* Stack trace */
.ff-stack-trace {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.ff-stack-frame {
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.ff-stack-frame:hover {
  background: rgba(255, 255, 255, 0.05);
}

.ff-stack-frame:last-child {
  border-bottom: none;
}

.ff-frame-number {
  color: #5c6370;
  font-size: 12px;
  min-width: 24px;
  text-align: right;
  flex-shrink: 0;
}

.ff-frame-content {
  flex: 1;
  min-width: 0;
}

.ff-frame-function {
  margin-bottom: 4px;
  font-size: 13px;
}

.ff-class-name {
  color: #e5c07b;
}

.ff-method-type {
  color: #56b6c2;
  margin: 0 4px;
}

.ff-function-name {
  color: #61afef;
  font-weight: 500;
}

.ff-frame-location-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ff-frame-location {
  color: #abb2bf;
  font-size: 12px;
  opacity: 0.8;
  flex: 1;
}

.ff-copy-path-btn {
  opacity: 0;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #abb2bf;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.ff-stack-frame:hover .ff-copy-path-btn {
  opacity: 1;
}

.ff-copy-path-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.ff-copy-path-btn.ff-copy-success {
  background: rgba(152, 195, 121, 0.2);
  color: #98c379;
}

/* Scrollbar */
.ff-overlay-body::-webkit-scrollbar {
  width: 8px;
}

.ff-overlay-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.ff-overlay-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.ff-overlay-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .ff-overlay {
    padding: 10px;
  }

  .ff-overlay-content {
    font-size: 13px;
  }

  .ff-overlay-header {
    padding: 16px 16px 0 16px;
  }

  .ff-overlay-body {
    padding: 16px;
  }

  .ff-toast {
    max-width: calc(100vw - 40px);
  }

  .ff-title {
    font-size: 18px;
  }

  .ff-copy-all-btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .ff-header-buttons {
    gap: 6px;
  }

  /* Always show copy buttons on mobile */
  .ff-copy-path-btn,
  .ff-copy-message-btn {
    opacity: 0.7;
  }
}
`;
