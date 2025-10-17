// Auto-Apply Error Handling

export enum AutoApplyErrorCode {
  INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS",
  CONFIGURATION_INVALID = "CONFIGURATION_INVALID",
  DATABASE_ERROR = "DATABASE_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  JOB_APPLICATION_FAILED = "JOB_APPLICATION_FAILED",
  RESUME_NOT_FOUND = "RESUME_NOT_FOUND",
  INVALID_FORM_DATA = "INVALID_FORM_DATA",
  AUTO_APPLY_DISABLED = "AUTO_APPLY_DISABLED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AutoApplyError {
  code: AutoApplyErrorCode;
  message: string;
  field?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export class AutoApplyErrorHandler {
  static createError(
    code: AutoApplyErrorCode,
    message: string,
    field?: string,
    details?: Record<string, any>
  ): AutoApplyError {
    return {
      code,
      message,
      field,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  static getErrorMessage(error: AutoApplyError): string {
    const errorMessages: Record<AutoApplyErrorCode, string> = {
      [AutoApplyErrorCode.INSUFFICIENT_CREDITS]:
        "You need at least 10 credits to use this feature. Please add more credits to continue.",
      [AutoApplyErrorCode.CONFIGURATION_INVALID]:
        "Your auto-apply configuration is invalid. Please check your settings and try again.",
      [AutoApplyErrorCode.DATABASE_ERROR]:
        "A database error occurred. Please try again later.",
      [AutoApplyErrorCode.AUTHENTICATION_ERROR]:
        "You must be logged in to use this feature.",
      [AutoApplyErrorCode.NETWORK_ERROR]:
        "Network error occurred. Please check your connection and try again.",
      [AutoApplyErrorCode.RATE_LIMIT_EXCEEDED]:
        "Too many requests. Please wait a moment before trying again.",
      [AutoApplyErrorCode.JOB_APPLICATION_FAILED]:
        "Failed to apply to job. Please try again or contact support.",
      [AutoApplyErrorCode.RESUME_NOT_FOUND]:
        "Selected resume not found. Please select a valid resume.",
      [AutoApplyErrorCode.INVALID_FORM_DATA]:
        "Please fill in all required fields correctly.",
      [AutoApplyErrorCode.AUTO_APPLY_DISABLED]:
        "Auto-apply is currently disabled. Please enable it first.",
      [AutoApplyErrorCode.UNKNOWN_ERROR]:
        "An unexpected error occurred. Please try again or contact support.",
    };

    return errorMessages[error.code] || error.message;
  }

  static getErrorSeverity(
    error: AutoApplyError
  ): "low" | "medium" | "high" | "critical" {
    const severityMap: Record<
      AutoApplyErrorCode,
      "low" | "medium" | "high" | "critical"
    > = {
      [AutoApplyErrorCode.INSUFFICIENT_CREDITS]: "medium",
      [AutoApplyErrorCode.CONFIGURATION_INVALID]: "medium",
      [AutoApplyErrorCode.DATABASE_ERROR]: "high",
      [AutoApplyErrorCode.AUTHENTICATION_ERROR]: "high",
      [AutoApplyErrorCode.NETWORK_ERROR]: "medium",
      [AutoApplyErrorCode.RATE_LIMIT_EXCEEDED]: "low",
      [AutoApplyErrorCode.JOB_APPLICATION_FAILED]: "medium",
      [AutoApplyErrorCode.RESUME_NOT_FOUND]: "medium",
      [AutoApplyErrorCode.INVALID_FORM_DATA]: "low",
      [AutoApplyErrorCode.AUTO_APPLY_DISABLED]: "low",
      [AutoApplyErrorCode.UNKNOWN_ERROR]: "high",
    };

    return severityMap[error.code];
  }

  static shouldRetry(error: AutoApplyError): boolean {
    const retryableErrors = [
      AutoApplyErrorCode.NETWORK_ERROR,
      AutoApplyErrorCode.RATE_LIMIT_EXCEEDED,
      AutoApplyErrorCode.DATABASE_ERROR,
    ];

    return retryableErrors.includes(error.code);
  }

  static logError(error: AutoApplyError, context?: Record<string, any>): void {
    const severity = this.getErrorSeverity(error);
    const logData = {
      ...error,
      context,
      severity,
      retryable: this.shouldRetry(error),
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Auto-Apply Error:", logData);
    }

    // In production, you would send this to your logging service
    // Example: sendToLoggingService(logData);
  }
}

export function handleAutoApplyError(error: unknown): AutoApplyError {
  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes("credits")) {
      return AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.INSUFFICIENT_CREDITS,
        error.message
      );
    }

    if (error.message.includes("auth")) {
      return AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.AUTHENTICATION_ERROR,
        error.message
      );
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      return AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.NETWORK_ERROR,
        error.message
      );
    }

    return AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.UNKNOWN_ERROR,
      error.message
    );
  }

  return AutoApplyErrorHandler.createError(
    AutoApplyErrorCode.UNKNOWN_ERROR,
    "An unexpected error occurred"
  );
}
