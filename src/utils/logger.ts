/**
 * Logging utility for consistent error tracking
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  info(message: string, data?: unknown): void {
    const entry = this.createEntry('info', message, data);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    console.log(`[INFO] ${message}`, data ?? '');
  }

  warn(message: string, data?: unknown): void {
    const entry = this.createEntry('warn', message, data);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    console.warn(`[WARN] ${message}`, data ?? '');
  }

  error(message: string, error?: Error | unknown): void {
    const entry = this.createEntry('error', message, error);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    console.error(`[ERROR] ${message}`, error ?? '');

    // In production, you would send this to an error tracking service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
