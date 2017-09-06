/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */

export interface ILruElement {
    lastRefresh: number;
    key: string;
}

export class CacheConfigOptions {
    key: string;
    evictionPeriod: number;
    refreshOnAccess: boolean;

    constructor(key: string, evictionPeriod: number, refreshOnAccess: boolean);
}

export class CacheEntry implements ILruElement{
    key: string;
    lastRefresh: number;
    data: any;

    constructor(key: string, lastRefresh: number, data: any);
}

/**
 * a specialized lru map which allows you to
 * handle size limited caches
 */
export class LruMap<T extends ILruElement> {

    length: number;
    keys: Array<string>;

    constructor(maxNoElements: number);

    get(key: string): T;
    put(key: string, element: T): void;
    hasKey(key: string): boolean;
    oldestElement: T;

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
        [key: string]: LruMap<CacheEntry>;
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

