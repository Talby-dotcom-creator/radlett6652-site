interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number;     // Time to live in ms
  maxSize?: number; // Maximum cache size
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100;              // Maximum cache entries

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl ?? this.defaultTTL;
    this.maxSize = options.maxSize ?? this.maxSize;
  }

  async get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    const entryTTL = ttl ?? this.defaultTTL;

    // Return cached data if valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      // console.log(`Cache hit for key: ${key}`);
      return cached.data as T;
    }

    // Remove expired entry (if any)
    if (cached) {
      this.cache.delete(key);
    }

    // console.log(`Cache miss for key: ${key}, fetching data...`);
    const data = await fetcher();

    // Ensure cache doesn't exceed max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value as string | undefined;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: entryTTL,
    });

    return data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    // console.log(`Cache invalidated for key: ${key}`);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
    // console.log(`Cache invalidated for pattern: ${pattern}`);
  }

  clear(): void {
    this.cache.clear();
    // console.log('Cache cleared');
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const dataCache = new DataCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
});

// Request deduplication utility
const requestCache = new Map<string, Promise<any>>();

export const deduplicateRequest = async <T>(
  key: string,
  request: () => Promise<T>
): Promise<T> => {
  const inFlight = requestCache.get(key) as Promise<T> | undefined;
  if (inFlight) {
    // console.log(`Request deduplication hit for key: ${key}`);
    return inFlight;
  }

  const promise = request();
  requestCache.set(key, promise);

  try {
    const result = await promise;
    requestCache.delete(key);
    return result;
  } catch (error) {
    requestCache.delete(key);
    throw error;
  }
};

// Cache keys constants — ✅ includes BLOG_POSTS now
export const CACHE_KEYS = {
  DOCUMENTS: 'documents',
  DOCUMENTS_BY_CATEGORY: (category: string) => `documents:${category}`,
  MEETING_MINUTES: 'meeting_minutes',
  MEMBERS: 'members',
  EVENTS: 'events',
  NEWS_ARTICLES: 'news_articles',
  OFFICERS: 'officers',
  TESTIMONIALS: 'testimonials',
  FAQ_ITEMS: 'faq_items',
  SITE_SETTINGS: 'site_settings',
  PAGE_CONTENT: (page: string) => `page_content:${page}`,
  BLOG_POSTS: 'blog_posts',
} as const;

export type CacheKeys = typeof CACHE_KEYS;
export type DataCacheType = DataCache;
