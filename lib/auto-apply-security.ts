// Auto-Apply Security and Rate Limiting

import { createClient } from "@/utils/supabase/server";
import { AutoApplyErrorHandler, AutoApplyErrorCode } from "./auto-apply-errors";

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator: (userId: string, action: string) => string;
}

// Security policies
export interface SecurityPolicy {
  maxConfigsPerUser: number;
  maxApplicationsPerDay: number;
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  maxSearchTermsLength: number;
  maxDescriptionLength: number;
}

// Default configurations
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  configCreation: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 5,
    keyGenerator: (userId, action) => `config_creation:${userId}`,
  },
  configUpdate: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (userId, action) => `config_update:${userId}`,
  },
  jobApplication: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
    keyGenerator: (userId, action) => `job_application:${userId}`,
  },
  jobSearch: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20,
    keyGenerator: (userId, action) => `job_search:${userId}`,
  },
  autoApplyActivation: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 3,
    keyGenerator: (userId, action) => `auto_apply_activation:${userId}`,
  },
};

export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  maxConfigsPerUser: 1,
  maxApplicationsPerDay: 100,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSearchTermsLength: 500,
  maxDescriptionLength: 5000,
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  private static async getRateLimitKey(
    userId: string,
    action: string,
    config: RateLimitConfig
  ): Promise<string> {
    return config.keyGenerator(userId, action);
  }

  private static async getCurrentCount(key: string): Promise<number> {
    const entry = rateLimitStore.get(key);
    if (!entry) return 0;

    if (Date.now() > entry.resetTime) {
      rateLimitStore.delete(key);
      return 0;
    }

    return entry.count;
  }

  private static async incrementCount(
    key: string,
    windowMs: number
  ): Promise<number> {
    const entry = rateLimitStore.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      const newEntry = { count: 1, resetTime: now + windowMs };
      rateLimitStore.set(key, newEntry);
      return 1;
    }

    entry.count++;
    return entry.count;
  }

  static async checkRateLimit(
    userId: string,
    action: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = await this.getRateLimitKey(userId, action, config);
    const currentCount = await this.getCurrentCount(key);

    if (currentCount >= config.maxRequests) {
      const entry = rateLimitStore.get(key);
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry?.resetTime || Date.now() + config.windowMs,
      };
    }

    const newCount = await this.incrementCount(key, config.windowMs);
    const entry = rateLimitStore.get(key);

    return {
      allowed: true,
      remaining: config.maxRequests - newCount,
      resetTime: entry?.resetTime || Date.now() + config.windowMs,
    };
  }

  static async resetRateLimit(
    userId: string,
    action: string,
    config: RateLimitConfig
  ): Promise<void> {
    const key = await this.getRateLimitKey(userId, action, config);
    rateLimitStore.delete(key);
  }
}

export class SecurityValidator {
  static async validateConfigCreation(
    userId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const supabase = await createClient();

    // Check if user already has max configs
    const { data: existingConfigs, error } = await supabase
      .from("auto_apply_configs")
      .select("id")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to check existing configurations");
    }

    if (
      existingConfigs &&
      existingConfigs.length >= DEFAULT_SECURITY_POLICY.maxConfigsPerUser
    ) {
      return {
        allowed: false,
        reason: `Maximum ${DEFAULT_SECURITY_POLICY.maxConfigsPerUser} configurations allowed per user`,
      };
    }

    return { allowed: true };
  }

  static async validateJobApplication(
    userId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const supabase = await createClient();

    // Check daily application limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayApplications, error } = await supabase
      .from("applied_jobs")
      .select("id")
      .eq("user_id", userId)
      .gte("applied_at", today.toISOString());

    if (error) {
      throw new Error("Failed to check application history");
    }

    if (
      todayApplications &&
      todayApplications.length >= DEFAULT_SECURITY_POLICY.maxApplicationsPerDay
    ) {
      return {
        allowed: false,
        reason: `Maximum ${DEFAULT_SECURITY_POLICY.maxApplicationsPerDay} applications per day allowed`,
      };
    }

    return { allowed: true };
  }

  static validateFileUpload(file: File): { allowed: boolean; reason?: string } {
    // Check file size
    if (file.size > DEFAULT_SECURITY_POLICY.maxFileSize) {
      return {
        allowed: false,
        reason: `File size must be less than ${
          DEFAULT_SECURITY_POLICY.maxFileSize / (1024 * 1024)
        }MB`,
      };
    }

    // Check file type
    if (!DEFAULT_SECURITY_POLICY.allowedFileTypes.includes(file.type)) {
      return {
        allowed: false,
        reason: `File type not allowed. Allowed types: ${DEFAULT_SECURITY_POLICY.allowedFileTypes.join(
          ", "
        )}`,
      };
    }

    return { allowed: true };
  }

  static validateSearchTerms(terms: string): {
    allowed: boolean;
    reason?: string;
  } {
    if (terms.length > DEFAULT_SECURITY_POLICY.maxSearchTermsLength) {
      return {
        allowed: false,
        reason: `Search terms must be less than ${DEFAULT_SECURITY_POLICY.maxSearchTermsLength} characters`,
      };
    }

    // Check for potentially malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(terms)) {
        return {
          allowed: false,
          reason: "Search terms contain potentially malicious content",
        };
      }
    }

    return { allowed: true };
  }

  static validateDescription(description: string): {
    allowed: boolean;
    reason?: string;
  } {
    if (description.length > DEFAULT_SECURITY_POLICY.maxDescriptionLength) {
      return {
        allowed: false,
        reason: `Description must be less than ${DEFAULT_SECURITY_POLICY.maxDescriptionLength} characters`,
      };
    }

    return { allowed: true };
  }
}

export class SecurityAuditor {
  static async logSecurityEvent(
    userId: string,
    event: string,
    details: Record<string, any>,
    severity: "low" | "medium" | "high" | "critical" = "low"
  ): Promise<void> {
    const supabase = await createClient();

    await supabase.from("auto_apply_activity_log").insert({
      user_id: userId,
      activity_type: "security_event" as any,
      description: `Security event: ${event}`,
      metadata: {
        event,
        details,
        severity,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static async detectSuspiciousActivity(
    userId: string
  ): Promise<{ suspicious: boolean; reasons: string[] }> {
    const supabase = await createClient();
    const reasons: string[] = [];

    // Check for rapid config changes
    const { data: recentConfigs } = await supabase
      .from("auto_apply_configs")
      .select("updated_at")
      .eq("user_id", userId)
      .gte("updated_at", new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (recentConfigs && recentConfigs.length > 5) {
      reasons.push("Rapid configuration changes detected");
    }

    // Check for excessive job applications
    const { data: recentApplications } = await supabase
      .from("applied_jobs")
      .select("applied_at")
      .eq("user_id", userId)
      .gte("applied_at", new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (recentApplications && recentApplications.length > 20) {
      reasons.push("Excessive job applications detected");
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
    };
  }
}

export class SecurityMiddleware {
  static async withRateLimit<T>(
    userId: string,
    action: string,
    config: RateLimitConfig,
    operation: () => Promise<T>
  ): Promise<T> {
    const rateLimit = await RateLimiter.checkRateLimit(userId, action, config);

    if (!rateLimit.allowed) {
      const error = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded. Try again after ${new Date(
          rateLimit.resetTime
        ).toLocaleString()}`
      );
      AutoApplyErrorHandler.logError(error);
      throw error;
    }

    return await operation();
  }

  static async withSecurityValidation<T>(
    userId: string,
    validation: () => Promise<{ allowed: boolean; reason?: string }>,
    operation: () => Promise<T>
  ): Promise<T> {
    const validationResult = await validation();

    if (!validationResult.allowed) {
      const error = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.CONFIGURATION_INVALID,
        validationResult.reason || "Security validation failed"
      );
      AutoApplyErrorHandler.logError(error);
      throw error;
    }

    return await operation();
  }

  static async withAuditLog<T>(
    userId: string,
    operation: () => Promise<T>,
    event: string,
    details: Record<string, any> = {}
  ): Promise<T> {
    const startTime = Date.now();
    let success = false;
    let error: any = null;

    try {
      const result = await operation();
      success = true;
      return result;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      await SecurityAuditor.logSecurityEvent(
        userId,
        event,
        {
          ...details,
          success,
          duration: Date.now() - startTime,
          error: error?.message,
        },
        success ? "low" : "medium"
      );
    }
  }
}

// Input sanitization for security
export class InputSanitizer {
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  static sanitizeSql(input: string): string {
    return input.replace(/'/g, "''").replace(/;/g, "");
  }

  static sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("Invalid protocol");
      }
      return urlObj.toString();
    } catch {
      return "";
    }
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\(\)\s]/g, "");
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
