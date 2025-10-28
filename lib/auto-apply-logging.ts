// Auto-Apply Logging and Monitoring System

import { createClient } from "@/utils/supabase/server";
import { AutoApplyErrorHandler, AutoApplyErrorCode } from "./auto-apply-errors";

// Log levels
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
}

// Log categories
export enum LogCategory {
  AUTHENTICATION = "authentication",
  CONFIGURATION = "configuration",
  JOB_APPLICATION = "job_application",
  JOB_SEARCH = "job_search",
  RATE_LIMITING = "rate_limiting",
  SECURITY = "security",
  PERFORMANCE = "performance",
  SYSTEM = "system",
}

// Log entry interface
export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration: number;
    memoryUsage?: number;
  };
}

// Logger class
export class AutoApplyLogger {
  private static instance: AutoApplyLogger;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;
  private flushInterval = 30000; // 30 seconds
  private isFlushing = false;

  private constructor() {
    // Start periodic flush
    setInterval(() => this.flush(), this.flushInterval);

    // Flush on process exit
    process.on("beforeExit", () => this.flush());
    process.on("SIGINT", () => this.flush());
    process.on("SIGTERM", () => this.flush());
  }

  static getInstance(): AutoApplyLogger {
    if (!AutoApplyLogger.instance) {
      AutoApplyLogger.instance = new AutoApplyLogger();
    }
    return AutoApplyLogger.instance;
  }

  private async log(entry: LogEntry): Promise<void> {
    // Add to buffer
    this.logBuffer.push(entry);

    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flush();
    }

    // Console logging in development
    if (process.env.NODE_ENV === "development") {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(7);
    const category = entry.category.toUpperCase().padEnd(15);

    console.log(
      `[${timestamp}] ${level} [${category}] ${entry.message}`,
      entry.metadata ? JSON.stringify(entry.metadata, null, 2) : "",
      entry.error ? `\nError: ${entry.error.message}` : ""
    );
  }

  private async flush(): Promise<void> {
    if (this.isFlushing || this.logBuffer.length === 0) {
      return;
    }

    this.isFlushing = true;
    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.persistLogs(logsToFlush);
    } catch (error) {
      console.error("Failed to flush logs:", error);
      // Re-add logs to buffer if persistence fails
      this.logBuffer.unshift(...logsToFlush);
    } finally {
      this.isFlushing = false;
    }
  }

  private async persistLogs(logs: LogEntry[]): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("auto_apply_activity_log").insert(
      logs.map((log) => ({
        user_id: log.userId,
        activity_type: "system_log" as any,
        description: log.message,
        metadata: {
          level: log.level,
          category: log.category,
          sessionId: log.sessionId,
          requestId: log.requestId,
          error: log.error,
          performance: log.performance,
          ...log.metadata,
        },
      }))
    );

    if (error) {
      throw new Error(`Failed to persist logs: ${error.message}`);
    }
  }

  // Public logging methods
  async debug(
    message: string,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      category: LogCategory.SYSTEM,
      message,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
    });
  }

  async info(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      category,
      message,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
    });
  }

  async warn(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      category,
      message,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
    });
  }

  async error(
    message: string,
    error?: Error,
    category: LogCategory = LogCategory.SYSTEM,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      category,
      message,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
      error: error
        ? {
            code: (error as any).code || "UNKNOWN_ERROR",
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  async critical(
    message: string,
    error?: Error,
    category: LogCategory = LogCategory.SYSTEM,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.CRITICAL,
      category,
      message,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
      error: error
        ? {
            code: (error as any).code || "CRITICAL_ERROR",
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  // Performance logging
  async performance(
    operation: string,
    duration: number,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      category: LogCategory.PERFORMANCE,
      message: `Performance: ${operation}`,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
      performance: {
        duration,
        memoryUsage: process.memoryUsage().heapUsed,
      },
    });
  }

  // Security logging
  async security(
    event: string,
    metadata?: Record<string, any>,
    context?: { userId?: string; sessionId?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      category: LogCategory.SECURITY,
      message: `Security event: ${event}`,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId,
      metadata,
    });
  }
}

// Monitoring utilities
export class AutoApplyMonitor {
  private static logger = AutoApplyLogger.getInstance();

  static async trackUserActivity(
    userId: string,
    activity: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.info(
      `User activity: ${activity}`,
      LogCategory.AUTHENTICATION,
      { activity, ...metadata },
      { userId }
    );
  }

  static async trackConfigurationChange(
    userId: string,
    action: string,
    configId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.info(
      `Configuration ${action}`,
      LogCategory.CONFIGURATION,
      { action, configId, ...metadata },
      { userId }
    );
  }

  static async trackJobApplication(
    userId: string,
    jobId: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.info(
      `Job application ${status}`,
      LogCategory.JOB_APPLICATION,
      { jobId, status, ...metadata },
      { userId }
    );
  }

  static async trackJobSearch(
    userId: string,
    searchTerms: string,
    resultsCount: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.info(
      `Job search performed`,
      LogCategory.JOB_SEARCH,
      { searchTerms, resultsCount, ...metadata },
      { userId }
    );
  }

  static async trackRateLimit(
    userId: string,
    action: string,
    limit: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.warn(
      `Rate limit exceeded for ${action}`,
      LogCategory.RATE_LIMITING,
      { action, limit, ...metadata },
      { userId }
    );
  }

  static async trackSecurityEvent(
    userId: string,
    event: string,
    severity: "low" | "medium" | "high" | "critical",
    metadata?: Record<string, any>
  ): Promise<void> {
    const message = `Security event: ${event}`;
    const combinedMetadata = { event, severity, ...metadata };

    if (severity === "critical") {
      await this.logger.critical(
        message,
        undefined,
        LogCategory.SECURITY,
        combinedMetadata,
        { userId }
      );
    } else if (severity === "high") {
      await this.logger.error(
        message,
        undefined,
        LogCategory.SECURITY,
        combinedMetadata,
        { userId }
      );
    } else if (severity === "medium") {
      await this.logger.warn(message, LogCategory.SECURITY, combinedMetadata, {
        userId,
      });
    } else {
      await this.logger.info(message, LogCategory.SECURITY, combinedMetadata, {
        userId,
      });
    }
  }

  static async trackPerformance(
    operation: string,
    duration: number,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.performance(operation, duration, metadata, { userId });
  }

  static async trackError(
    error: Error,
    context: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logger.error(
      `Error in ${context}`,
      error,
      LogCategory.SYSTEM,
      metadata,
      { userId }
    );
  }
}

// Performance monitoring decorator
export function withPerformanceMonitoring<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    let userId: string | undefined;

    try {
      // Try to extract userId from first argument if it's an object with userId
      if (args[0] && typeof args[0] === "object" && "userId" in args[0]) {
        userId = (args[0] as any).userId;
      }

      const result = await fn(...args);

      await AutoApplyMonitor.trackPerformance(
        operation,
        Date.now() - startTime,
        userId
      );

      return result;
    } catch (error) {
      await AutoApplyMonitor.trackError(error as Error, operation, userId);
      throw error;
    }
  };
}

// Request logging middleware
export function withRequestLogging<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    await AutoApplyLogger.getInstance().info(
      `Starting ${operation}`,
      LogCategory.SYSTEM,
      { requestId },
      { requestId }
    );

    try {
      const result = await fn(...args);

      await AutoApplyLogger.getInstance().info(
        `Completed ${operation}`,
        LogCategory.SYSTEM,
        {
          requestId,
          duration: Date.now() - startTime,
          success: true,
        },
        { requestId }
      );

      return result;
    } catch (error) {
      await AutoApplyLogger.getInstance().error(
        `Failed ${operation}`,
        error as Error,
        LogCategory.SYSTEM,
        {
          requestId,
          duration: Date.now() - startTime,
          success: false,
        },
        { requestId }
      );
      throw error;
    }
  };
}

// Health check monitoring
export class HealthChecker {
  static async checkDatabase(): Promise<{
    healthy: boolean;
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("auto_apply_configs")
        .select("id")
        .limit(1);

      const latency = Date.now() - startTime;

      if (error) {
        return { healthy: false, latency, error: error.message };
      }

      return { healthy: true, latency };
    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }

  static async checkSystemHealth(): Promise<{
    database: { healthy: boolean; latency: number; error?: string };
    memory: { used: number; total: number; percentage: number };
    uptime: number;
  }> {
    const database = await this.checkDatabase();
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    return {
      database,
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage,
      },
      uptime: process.uptime(),
    };
  }
}

// Export singleton logger instance
export const logger = AutoApplyLogger.getInstance();
export const monitor = AutoApplyMonitor;
