/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */


export class CacheConfigOptions {
    key: string;
    evictionPeriod: number;
    refreshOnAccess: boolean;

    constructor(key: string, evictionPeriod: number, refreshOnAccess: boolean);
}

export class CacheEntry {
    key: string;
    lastRefresh: number;
    data: any;

    constructor(key: string, lastRefresh: number, data: any);
}

/**
 * a specialized lru map which allows you to
 * handle size limited caches
 */
export class LruMap {

    length: number;
    keys: Array<string>;

    constructor(maxNoElements: number);

    get(key: string): CacheEntry;
    put(key: string, element: CacheEntry): void;
    hasKey(key: string): boolean;
    oldestElement: CacheEntry;

    remove(key: string): void;
    trim(): void;
    clear(): void;
}


export class SystemCache {
    cacheConfigs: {
        [key: string]: CacheConfigOptions;
    };
    evictionIntervals: {
        [key: string]: any;
    };
    cache: {
        [key: string]: LruMap;
    };

    initCache(opts: CacheConfigOptions): void;

    putCache(cacheKey: string, cacheEntryKey: string, ret: any): void;

    getFromCache(cacheKey: string, cacheEntryKey: string): any;

    touch(cacheKey: string, cacheEntryKey?: string): void;

    hasEntry(cacheKey: string, cacheEntryKey: string): boolean;

    clearCache(cacheKey: string, cacheEntry?: string): void;
}

export var systemCache: SystemCache;

export function CacheConfig(options: CacheConfigOptions | string): (constructor: any) => any;

export function CachePut(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;

export function Cacheable(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;

export function CacheEvict(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;

