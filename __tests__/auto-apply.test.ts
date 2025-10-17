// Auto-Apply Feature Tests

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  AutoApplyErrorHandler,
  AutoApplyErrorCode,
} from "@/lib/auto-apply-errors";
import { ValidationHelper, FileValidator } from "@/lib/auto-apply-validation";
import { RateLimiter, SecurityValidator } from "@/lib/auto-apply-security";
import { AutoApplyCache } from "@/lib/auto-apply-cache";

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({ data: {}, error: null })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: {}, error: null })),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({ error: null })),
    })),
  })),
};

// Mock createClient
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe("Auto-Apply Error Handling", () => {
  it("should create error with correct properties", () => {
    const error = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.INSUFFICIENT_CREDITS,
      "Not enough credits",
      "credits"
    );

    expect(error.code).toBe(AutoApplyErrorCode.INSUFFICIENT_CREDITS);
    expect(error.message).toBe("Not enough credits");
    expect(error.field).toBe("credits");
    expect(error.timestamp).toBeDefined();
  });

  it("should get correct error message", () => {
    const error = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.INSUFFICIENT_CREDITS,
      "Test error"
    );

    const message = AutoApplyErrorHandler.getErrorMessage(error);
    expect(message).toContain("credits");
  });

  it("should determine correct error severity", () => {
    const criticalError = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.DATABASE_ERROR,
      "Database error"
    );

    const severity = AutoApplyErrorHandler.getErrorSeverity(criticalError);
    expect(severity).toBe("high");
  });

  it("should identify retryable errors", () => {
    const networkError = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.NETWORK_ERROR,
      "Network error"
    );

    const retryable = AutoApplyErrorHandler.shouldRetry(networkError);
    expect(retryable).toBe(true);
  });
});

describe("Auto-Apply Validation", () => {
  it("should validate email correctly", () => {
    expect(ValidationHelper.validateEmail("test@example.com")).toBe(true);
    expect(ValidationHelper.validateEmail("invalid-email")).toBe(false);
  });

  it("should validate phone correctly", () => {
    expect(ValidationHelper.validatePhone("+1234567890")).toBe(true);
    expect(ValidationHelper.validatePhone("123-456-7890")).toBe(true);
    expect(ValidationHelper.validatePhone("invalid")).toBe(false);
  });

  it("should validate URL correctly", () => {
    expect(ValidationHelper.validateUrl("https://example.com")).toBe(true);
    expect(ValidationHelper.validateUrl("http://example.com")).toBe(true);
    expect(ValidationHelper.validateUrl("invalid-url")).toBe(false);
  });

  it("should validate required fields", () => {
    const data = { name: "John", email: "john@example.com" };
    const requiredFields = ["name", "email", "phone"];

    const result = ValidationHelper.validateRequiredFields(
      data,
      requiredFields
    );
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain("phone");
  });

  it("should validate file upload", () => {
    const validFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const invalidFile = new File(["content"], "test.txt", {
      type: "text/plain",
    });

    expect(FileValidator.validateResumeFile(validFile).isValid).toBe(true);
    expect(FileValidator.validateResumeFile(invalidFile).isValid).toBe(false);
  });
});

describe("Auto-Apply Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should check rate limit correctly", async () => {
    const userId = "test-user";
    const action = "test-action";
    const config = {
      windowMs: 60000,
      maxRequests: 5,
      keyGenerator: (userId: string, action: string) => `${action}:${userId}`,
    };

    // First request should be allowed
    const result1 = await RateLimiter.checkRateLimit(userId, action, config);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(4);

    // Multiple requests should eventually hit limit
    for (let i = 0; i < 4; i++) {
      await RateLimiter.checkRateLimit(userId, action, config);
    }

    const result2 = await RateLimiter.checkRateLimit(userId, action, config);
    expect(result2.allowed).toBe(false);
  });

  it("should validate configuration creation", async () => {
    const userId = "test-user";

    // Mock no existing configs
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: { code: "PGRST116" } })),
        })),
      })),
    });

    const result = await SecurityValidator.validateConfigCreation(userId);
    expect(result.allowed).toBe(true);
  });

  it("should validate job application limits", async () => {
    const userId = "test-user";

    // Mock no applications today
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({ data: [], error: null })),
        })),
      })),
    });

    const result = await SecurityValidator.validateJobApplication(userId);
    expect(result.allowed).toBe(true);
  });

  it("should validate file upload security", () => {
    const validFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const oversizedFile = new File(["x".repeat(11 * 1024 * 1024)], "test.pdf", {
      type: "application/pdf",
    });

    expect(SecurityValidator.validateFileUpload(validFile).allowed).toBe(true);
    expect(SecurityValidator.validateFileUpload(oversizedFile).allowed).toBe(
      false
    );
  });

  it("should validate search terms security", () => {
    const safeTerms = "software engineer javascript";
    const maliciousTerms = '<script>alert("xss")</script>';

    expect(SecurityValidator.validateSearchTerms(safeTerms).allowed).toBe(true);
    expect(SecurityValidator.validateSearchTerms(maliciousTerms).allowed).toBe(
      false
    );
  });
});

describe("Auto-Apply Caching", () => {
  let cache: AutoApplyCache<string>;

  beforeEach(() => {
    cache = new AutoApplyCache();
  });

  afterEach(() => {
    cache.clear();
  });

  it("should store and retrieve data", () => {
    cache.set("test-key", "test-value");
    expect(cache.get("test-key")).toBe("test-value");
  });

  it("should handle cache expiration", async () => {
    cache.set("test-key", "test-value", 100); // 100ms TTL

    expect(cache.get("test-key")).toBe("test-value");

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get("test-key")).toBe(null);
  });

  it("should handle cache size limits", () => {
    const smallCache = new AutoApplyCache({ maxSize: 2, ttl: 60000 });

    smallCache.set("key1", "value1");
    smallCache.set("key2", "value2");
    smallCache.set("key3", "value3");

    expect(smallCache.get("key1")).toBe(null); // Should be evicted
    expect(smallCache.get("key2")).toBe("value2");
    expect(smallCache.get("key3")).toBe("value3");
  });

  it("should check if key exists", () => {
    cache.set("test-key", "test-value");
    expect(cache.has("test-key")).toBe(true);
    expect(cache.has("non-existent")).toBe(false);
  });

  it("should delete keys", () => {
    cache.set("test-key", "test-value");
    expect(cache.has("test-key")).toBe(true);

    cache.delete("test-key");
    expect(cache.has("test-key")).toBe(false);
  });

  it("should clear all data", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
  });
});

describe("Auto-Apply Integration", () => {
  it("should handle complete workflow", async () => {
    const userId = "test-user";

    // Mock successful database operations
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: { code: "PGRST116" } })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: "config-id" }, error: null })),
        })),
      })),
    });

    // Test configuration creation
    const configValidation = await SecurityValidator.validateConfigCreation(
      userId
    );
    expect(configValidation.allowed).toBe(true);

    // Test rate limiting
    const rateLimit = await RateLimiter.checkRateLimit(
      userId,
      "configCreation",
      {
        windowMs: 60000,
        maxRequests: 5,
        keyGenerator: (userId, action) => `${action}:${userId}`,
      }
    );
    expect(rateLimit.allowed).toBe(true);
  });
});

describe("Error Recovery", () => {
  it("should handle network errors gracefully", () => {
    const networkError = new Error("Network request failed");
    const autoApplyError = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.NETWORK_ERROR,
      "Network error occurred"
    );

    expect(AutoApplyErrorHandler.shouldRetry(autoApplyError)).toBe(true);
  });

  it("should handle database errors gracefully", () => {
    const dbError = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.DATABASE_ERROR,
      "Database connection failed"
    );

    expect(AutoApplyErrorHandler.getErrorSeverity(dbError)).toBe("high");
  });

  it("should handle validation errors gracefully", () => {
    const validationError = AutoApplyErrorHandler.createError(
      AutoApplyErrorCode.INVALID_FORM_DATA,
      "Invalid form data"
    );

    expect(AutoApplyErrorHandler.getErrorSeverity(validationError)).toBe("low");
  });
});

describe("Performance", () => {
  it("should handle large datasets efficiently", () => {
    const cache = new AutoApplyCache<string>();

    // Add many items
    for (let i = 0; i < 1000; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }

    expect(cache.size()).toBeLessThanOrEqual(100); // Should respect max size
  });

  it("should clean up expired entries efficiently", async () => {
    const cache = new AutoApplyCache<string>({ ttl: 50, maxSize: 100 });

    // Add items with short TTL
    for (let i = 0; i < 10; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 100));

    // All items should be expired
    for (let i = 0; i < 10; i++) {
      expect(cache.get(`key-${i}`)).toBe(null);
    }
  });
});
