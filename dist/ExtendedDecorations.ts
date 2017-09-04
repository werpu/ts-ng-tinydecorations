/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */

import {AngularCtor} from "../../../example/lib/typescript/TinyDecorations";
import {IPromise} from "angular";
import {Promise} from "q";

/**
 * Cache... cache annotation similar to what spring-cache provides
 * on the java side.
 */

//@Cacheable
//@CachePut
//@CacheEvict
//@CacheConfig

const TEN_MINUTES = 10 * 60 * 1000;

export class CacheConfigOptions {
    key: string;
    evicitionPeriod: number;
    refreshOnAccess: boolean;


    constructor(key: string, evicitionPeriod: number, refreshOnAccess: boolean) {
        this.key = key;
        this.evicitionPeriod = evicitionPeriod;

        this.refreshOnAccess = refreshOnAccess;
    }
}

export class CacheEntry {
    key: string;
    lastRefresh: number;
    data: any;


    constructor(key: string, lastRefresh: number, data: any) {
        this.key = key;
        this.lastRefresh = lastRefresh;
        this.data = data;
    }
}


let stringify = function (args: any) {
    return JSON.stringify([].slice.call(<any>args).slice(0, args.length));
};


export class SystemCache {
    cacheConfigs: { [key: string]: CacheConfigOptions } = {};
    evictionIntervals: { [key: string]: any };
    cache: { [key: string]: { [key: string]: CacheEntry } };

    initCache(opts: CacheConfigOptions) {
        //central gc routine, it performs a mark and sweep on the cache entries
        if (this.evictionIntervals[opts.key]) {
            return;
        }
        this.evictionIntervals[opts.key] = setInterval(() => {
            this.cache[opts.key] = {};
            let purge: Array<string> = [];
            for (let key in this.cache[opts.key].keys) {
                let entry = this.cache[opts.key][key];
                if ((entry.lastRefresh + opts.evicitionPeriod ) < new Date().getTime()) { //eviction point started
                    purge.push(key);
                }
            }
            for (let cnt = 0; cnt < purge.length; cnt++) {
                delete this.cache[opts.key][purge[cnt]];
            }

            if (!this.cache[opts.key].keys) {
                clearInterval(this.evictionIntervals[opts.key]);
                delete this.evictionIntervals[opts.key];
            }
        }, opts.evicitionPeriod);
    }

    putCache(cacheKey: string, cacheEntryKey: string, ret: any) {
        let cacheConfig = this.cacheConfigs[cacheKey];
        if (!cacheConfig) {
            cacheConfig = new CacheConfigOptions(cacheKey, TEN_MINUTES, true);
        }
        this.initCache(cacheConfig);
        //asynchronous ret?
        let cacheData = null;
        if (ret instanceof Promise) {
            ret.then((data: any) => {
                cacheData = data;
                return data;
            });
        } else {
            cacheData = ret;
        }
        if (cacheData) {
            let cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheConfig.refreshOnAccess);
            this.cache[cacheKey][cacheEntryKey] = cacheEntry;
        }
    }

    getFromCache(cacheKey: string, cacheEntryKey: string): any {
        if (this.hasEntry(cacheKey, cacheEntryKey)) {
            return null;
        }
        this.touch(cacheKey, cacheEntryKey);
        return this.cache[cacheKey][cacheEntryKey];
    }

    touch(cacheKey: string, cacheEntryKey?: string) {

        if (!this.cacheConfigs[cacheKey] || !this.cache[cacheKey]) {
            return;
        }
        let refreshOnAccess = this.cacheConfigs[cacheKey].refreshOnAccess;


        if (cacheEntryKey) {
            if (!this.cache[cacheKey][cacheEntryKey]) {
                return;
            }
            if (refreshOnAccess) {
                this.cache[cacheKey][cacheEntryKey].lastRefresh = new Date().getTime();
                return;
            }

        } else {
            for (var key in this.cache[cacheKey]) {
                if (refreshOnAccess) {
                    this.cache[cacheKey][key].lastRefresh = new Date().getTime();
                }
            }
        }
    }

    hasEntry(cacheKey: string, cacheEntryKey: string) {
        return !this.cache[cacheKey] || !this.cache[cacheKey][cacheEntryKey];
    }

    clearCache(cacheKey: string, cacheEntry ?: string) {
        if (!this.cacheConfigs[cacheKey]) {
            return;
        }
        if (cacheEntry) {
            delete this.cache[cacheKey][cacheEntry];
            return;
        }

        if (this.evictionIntervals[cacheKey]) {
            clearInterval(this.evictionIntervals[cacheKey]);
            delete this.evictionIntervals[cacheKey];
        }
        delete this.cacheConfigs[cacheKey];
        delete this.cache[cacheKey];
    }
}


export var systemCache = new SystemCache();


export function CacheConfig(options: CacheConfigOptions | string) {
    if ("string" == typeof options || options instanceof String) {

        options = new CacheConfigOptions(<string> options, TEN_MINUTES, true);
    }
    var opts = <CacheConfigOptions>options;
    systemCache.cacheConfigs[opts.key] = opts;


    return (constructor: AngularCtor<Object>): any => {
        constructor.prototype.__cache_config__ = options;
        return constructor;
    }
}



/*
 * Decorators
 */
export function CachePut(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target[propertyName];
        target.prototype[propertyName] = function () {
            let cacheKey = key || propertyName; //TODO prop descriptor????
            let cacheEntryKey = propertyName + "_" + stringify(arguments);
            let ret = oldFunc.apply(this, oldFunc);
            systemCache.putCache(cacheKey, cacheEntryKey, ret);
            return ret;
        }
    }
}

export function Cacheable(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target[propertyName];
        target.prototype[propertyName] = function () {
            let cacheKey = key || propertyName; //TODO prop descriptor????
            let cacheEntryKey = propertyName + "_" + stringify(arguments);

            let cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
            if (cached) {
                return cached;
            }
            let ret = oldFunc.apply(this, oldFunc);
            systemCache.putCache(cacheKey, cacheEntryKey, ret);
            return ret;
        }
    }
}

export function CacheEvict(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target[propertyName];
        target.prototype[propertyName] = function () {
            let cacheKey = key || propertyName; //TODO prop descriptor????
            let cacheEntryKey = propertyName + "_" + stringify(arguments);

            let cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
            systemCache.clearCache(cacheKey);
            if (cached) {
                return cached;
            }
            return oldFunc.apply(this, oldFunc);
        }
    }
}




