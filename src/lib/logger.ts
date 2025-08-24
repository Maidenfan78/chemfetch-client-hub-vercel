// src/lib/logger.ts - Client Hub Console Logging
// Vercel captures console output - no file system logging needed

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  component: string;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

class ClientLogger {
  private formatLogEntry(entry: LogEntry): string {
    const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
    const userStr = entry.userId ? ` | user:${entry.userId}` : '';
    const sessionStr = entry.sessionId ? ` | session:${entry.sessionId}` : '';
    return `${entry.timestamp} [${entry.level}] [${entry.component}] ${entry.message}${dataStr}${userStr}${sessionStr}`;
  }

  info(component: string, message: string, data?: any, userId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      component,
      message,
      data,
      userId,
    };
    console.info(this.formatLogEntry(entry));
  }

  warn(component: string, message: string, data?: any, userId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      component,
      message,
      data,
      userId,
    };
    console.warn(this.formatLogEntry(entry));
  }

  error(component: string, message: string, data?: any, userId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      component,
      message,
      data,
      userId,
    };
    console.error(this.formatLogEntry(entry));
  }

  debug(component: string, message: string, data?: any, userId?: string) {
    if (process.env.NODE_ENV === 'development') {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        component,
        message,
        data,
        userId,
      };
      console.debug(this.formatLogEntry(entry));
    }
  }

  // For compatibility with existing code that might expect these methods
  async getRecentLogs(): Promise<string> {
    return 'Console logging only - check Vercel function logs in dashboard';
  }
}

export const clientLogger = new ClientLogger();
export default clientLogger;
