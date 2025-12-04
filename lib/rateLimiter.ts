// utils/rateLimiter.ts
import redis from "@/lib/redis";

// Simple in-memory fallback store used only when Redis is unavailable.
// Keyed by user id; values mirror the Redis hash { tokens, last } semantics.
const inMemoryBuckets: Record<
  string,
  { tokens: number; last: number; expiresAt: number }
> = {};

function readFromMemory(key: string) {
  const entry = inMemoryBuckets[key];
  if (!entry) return null;
  // Expire entries past their TTL
  if (Date.now() / 1000 > entry.expiresAt) {
    delete inMemoryBuckets[key];
    return null;
  }
  return {
    tokens: entry.tokens.toString(),
    last: entry.last.toString(),
  } as const;
}

function writeToMemory(
  key: string,
  tokens: number,
  last: number,
  ttlSeconds: number
) {
  inMemoryBuckets[key] = {
    tokens,
    last,
    expiresAt: Date.now() / 1000 + ttlSeconds,
  };
}

/**
 * Checks and updates the leaky bucket for a given user.
 *
 * @param userId - The unique identifier for the Pro user.
 * @param capacity - Maximum number of allowed messages (default: 80).
 * @param duration - The duration (in seconds) over which the capacity is allowed (default: 5 hours).
 * @throws An error if the rate limit is exceeded.
 */
export async function checkRateLimit(
  userId: string,
  capacity: number = 80,
  duration: number = 5 * 60 * 60 // 5 hours in seconds
): Promise<void> {
  const LEAK_RATE = capacity / duration; // tokens leaked per second
  const redisKey = `rate-limit:pro:${userId}`;
  const now = Date.now() / 1000; // current time in seconds

  // Try to get existing bucket data from Redis; fall back to memory if Redis is unavailable.
  let bucket: { tokens?: string; last?: string } | null = null;
  let usingMemory = false;
  try {
    bucket = await redis.hgetall(redisKey);
  } catch {
    bucket = readFromMemory(redisKey);
    usingMemory = true;
  }
  let tokens: number;
  let last: number;

  if (!bucket || !bucket.tokens || !bucket.last) {
    // No bucket exists yet—initialize it.
    tokens = 0;
    last = now;
    // Set an expiration a bit longer than the duration so that stale data is removed.
    if (usingMemory) {
      writeToMemory(redisKey, tokens, last, duration + 3600);
    } else {
      try {
        await redis.expire(redisKey, duration + 3600);
      } catch {
        // Redis failed; ensure memory fallback is primed
        writeToMemory(redisKey, tokens, last, duration + 3600);
        usingMemory = true;
      }
    }
  } else {
    tokens = parseFloat(bucket.tokens as string);
    last = parseFloat(bucket.last as string);
  }

  // Compute the time elapsed since the last update and "leak" tokens.
  const delta = now - last;
  tokens = Math.max(0, tokens - delta * LEAK_RATE);

  // Add one token for the current request.
  const newTokens = tokens + 1;

  if (newTokens > capacity) {
    // Calculate how many seconds remain until the bucket drains enough.
    const timeLeft = Math.ceil(((newTokens - capacity) * duration) / capacity);
    throw new Error(`Rate limit exceeded. Try again in ${timeLeft} seconds.`);
  }

  // Update the bucket in Redis with the new token count and current timestamp.
  if (usingMemory) {
    writeToMemory(redisKey, newTokens, now, duration + 3600);
  } else {
    try {
      await redis.hset(redisKey, {
        tokens: newTokens.toString(),
        last: now.toString(),
      });
      await redis.expire(redisKey, duration + 3600);
    } catch {
      // On write failure, continue with memory fallback to avoid crashing.
      writeToMemory(redisKey, newTokens, now, duration + 3600);
    }
  }
}
