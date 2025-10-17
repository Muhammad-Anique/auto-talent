// Auto-Apply State Management and Caching

import {
  AutoApplyConfig,
  AppliedJob,
  AutoApplyStatus,
} from "./auto-apply-types";

// Cache configuration
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
  enablePersistence: boolean; // Whether to persist to localStorage
}

// Default cache configuration
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  enablePersistence: true,
};

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Generic cache class
export class AutoApplyCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
    this.loadFromStorage();

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  private getStorageKey(key: string): string {
    return `auto_apply_cache_${key}`;
  }

  private loadFromStorage(): void {
    if (!this.config.enablePersistence || typeof window === "undefined") {
      return;
    }

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("auto_apply_cache_")
      );

      for (const storageKey of keys) {
        const cacheKey = storageKey.replace("auto_apply_cache_", "");
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);

          // Check if entry is still valid
          if (Date.now() - entry.timestamp < entry.ttl) {
            this.cache.set(cacheKey, entry);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load cache from storage:", error);
    }
  }

  private saveToStorage(key: string, entry: CacheEntry<T>): void {
    if (!this.config.enablePersistence || typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.warn("Failed to save cache to storage:", error);
    }
  }

  private removeFromStorage(key: string): void {
    if (!this.config.enablePersistence || typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("Failed to remove cache from storage:", error);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.removeFromStorage(key);
    }

    // Remove oldest entries if cache is too large
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize);
      for (const [key] of toRemove) {
        this.cache.delete(key);
        this.removeFromStorage(key);
      }
    }
  }

  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
    };

    this.cache.set(key, entry);
    this.saveToStorage(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.removeFromStorage(key);
  }

  clear(): void {
    this.cache.clear();

    if (this.config.enablePersistence && typeof window !== "undefined") {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("auto_apply_cache_")
      );
      for (const key of keys) {
        localStorage.removeItem(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Specialized caches for different data types
export class AutoApplyConfigCache extends AutoApplyCache<AutoApplyConfig> {
  constructor() {
    super({
      ttl: 10 * 60 * 1000, // 10 minutes
      maxSize: 50,
      enablePersistence: true,
    });
  }

  getUserConfig(userId: string): AutoApplyConfig | null {
    return this.get(`user_config_${userId}`);
  }

  setUserConfig(userId: string, config: AutoApplyConfig): void {
    this.set(`user_config_${userId}`, config);
  }

  invalidateUserConfig(userId: string): void {
    this.delete(`user_config_${userId}`);
  }
}

export class AppliedJobsCache extends AutoApplyCache<AppliedJob[]> {
  constructor() {
    super({
      ttl: 2 * 60 * 1000, // 2 minutes
      maxSize: 100,
      enablePersistence: false, // Don't persist job data
    });
  }

  getUserJobs(userId: string): AppliedJob[] | null {
    return this.get(`user_jobs_${userId}`);
  }

  setUserJobs(userId: string, jobs: AppliedJob[]): void {
    this.set(`user_jobs_${userId}`, jobs);
  }

  invalidateUserJobs(userId: string): void {
    this.delete(`user_jobs_${userId}`);
  }
}

export class AutoApplyStatusCache extends AutoApplyCache<AutoApplyStatus> {
  constructor() {
    super({
      ttl: 1 * 60 * 1000, // 1 minute
      maxSize: 50,
      enablePersistence: false,
    });
  }

  getUserStatus(userId: string): AutoApplyStatus | null {
    return this.get(`user_status_${userId}`);
  }

  setUserStatus(userId: string, status: AutoApplyStatus): void {
    this.set(`user_status_${userId}`, status);
  }

  invalidateUserStatus(userId: string): void {
    this.delete(`user_status_${userId}`);
  }
}

// Cache manager for coordinating multiple caches
export class CacheManager {
  private static instance: CacheManager;
  private configCache: AutoApplyConfigCache;
  private jobsCache: AppliedJobsCache;
  private statusCache: AutoApplyStatusCache;

  private constructor() {
    this.configCache = new AutoApplyConfigCache();
    this.jobsCache = new AppliedJobsCache();
    this.statusCache = new AutoApplyStatusCache();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  getConfigCache(): AutoApplyConfigCache {
    return this.configCache;
  }

  getJobsCache(): AppliedJobsCache {
    return this.jobsCache;
  }

  getStatusCache(): AutoApplyStatusCache {
    return this.statusCache;
  }

  // Invalidate all caches for a user
  invalidateUser(userId: string): void {
    this.configCache.invalidateUserConfig(userId);
    this.jobsCache.invalidateUserJobs(userId);
    this.statusCache.invalidateUserStatus(userId);
  }

  // Clear all caches
  clearAll(): void {
    this.configCache.clear();
    this.jobsCache.clear();
    this.statusCache.clear();
  }

  // Get cache statistics
  getStats(): {
    configCache: { size: number; keys: string[] };
    jobsCache: { size: number; keys: string[] };
    statusCache: { size: number; keys: string[] };
  } {
    return {
      configCache: {
        size: this.configCache.size(),
        keys: this.configCache.keys(),
      },
      jobsCache: {
        size: this.jobsCache.size(),
        keys: this.jobsCache.keys(),
      },
      statusCache: {
        size: this.statusCache.size(),
        keys: this.statusCache.keys(),
      },
    };
  }
}

// React hook for cache management
export function useAutoApplyCache() {
  const cacheManager = CacheManager.getInstance();

  return {
    configCache: cacheManager.getConfigCache(),
    jobsCache: cacheManager.getJobsCache(),
    statusCache: cacheManager.getStatusCache(),
    invalidateUser: (userId: string) => cacheManager.invalidateUser(userId),
    clearAll: () => cacheManager.clearAll(),
    getStats: () => cacheManager.getStats(),
  };
}

// Cache warming utilities
export class CacheWarmer {
  private static cacheManager = CacheManager.getInstance();

  static async warmUserCache(userId: string): Promise<void> {
    try {
      // This would typically fetch data from API and populate cache
      // Implementation depends on your API structure
      console.log(`Warming cache for user ${userId}`);
    } catch (error) {
      console.error("Failed to warm cache:", error);
    }
  }

  static async warmAllCaches(): Promise<void> {
    try {
      // Warm all active user caches
      console.log("Warming all caches");
    } catch (error) {
      console.error("Failed to warm all caches:", error);
    }
  }
}

// Export singleton cache manager
export const cacheManager = CacheManager.getInstance();
