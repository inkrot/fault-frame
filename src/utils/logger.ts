/**
 * Debug logger for FaultFrame
 */

export class FaultFrameLogger {
  private static enabled = false; // Set to true to enable debug logs

  static log(context: string, ...args: any[]): void {
    if (!this.enabled) return;
    console.log(`[FaultFrame ${context}]`, ...args);
  }

  static error(context: string, ...args: any[]): void {
    if (!this.enabled) return;
    console.error(`[FaultFrame ${context}]`, ...args);
  }

  static warn(context: string, ...args: any[]): void {
    if (!this.enabled) return;
    console.warn(`[FaultFrame ${context}]`, ...args);
  }

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
