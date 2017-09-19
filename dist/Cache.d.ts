/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

declare module "Cache" {


    export class CacheConfigOptions {
        key: string;
        evictionPeriod: number;
        refreshOnAccess: boolean;

        constructor(key: string, evictionPeriod: number, refreshOnAccess: boolean);
    }

    export interface ILruElement {
        lastRefresh: number;
        key: string;
    }

    export class CacheEntry implements ILruElement {
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

        constructor(maxNoElements?: number);

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

    export function Cached(options: CacheConfigOptions | string): (constructor: any) => any;

    export function CachePut(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;

    export function Cacheable(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;

    export function CacheEvict(key?: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;


}