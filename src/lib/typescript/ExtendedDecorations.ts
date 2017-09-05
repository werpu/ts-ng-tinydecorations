/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */

import {AngularCtor} from "../../../example/lib/typescript/TinyDecorations";


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
    maxCacheSize: number;

    constructor(key: string, evicitionPeriod: number, refreshOnAccess: boolean, maxCacheSize = -1) {
        this.key = key;
        this.evicitionPeriod = evicitionPeriod;

        this.refreshOnAccess = refreshOnAccess;
        this.maxCacheSize = maxCacheSize;
    }
}

export class CacheEntry {
    key: string;
    lastRefresh: number;
    data: any;
    promise: boolean;


    constructor(key: string, lastRefresh: number, data: any, promise = false) {
        this.key = key;
        this.lastRefresh = lastRefresh;
        this.data = data;
        this.promise = promise;
    }
}


let stringify = function (args: any) {
    return JSON.stringify([].slice.call(<any>args).slice(0, args.length));
};


export class SystemCache {
    cacheConfigs: { [key: string]: CacheConfigOptions } = {};
    evictionIntervals: { [key: string]: any } = {};
    cache: { [key: string]: { [key: string]: CacheEntry } } = {};

    initCache(opts: CacheConfigOptions) {
        //central gc routine, it performs a mark and sweep on the cache entries
        if (this.evictionIntervals[opts.key]) {
            return;
        }
        this.evictionIntervals[opts.key] = setInterval(() => {
            //this.cache[opts.key] = {};
            let purge: Array<string> = [];
            for (let key in this.cache[opts.key]) {
                let entry = this.cache[opts.key][key];
                let refresTimestamp = entry.lastRefresh + opts.evicitionPeriod;
                let curr = new Date().getTime();

                if ( refresTimestamp <= curr) { //eviction point started
                    purge.push(key);
                }
            }
            for (let cnt = 0; cnt < purge.length; cnt++) {
                delete this.cache[opts.key][purge[cnt]];
            }

            if (!this.cache[opts.key] || !Object.keys(this.cache[opts.key]).length) {
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
        if (!!(ret && ret.then)) {
            ret.then((data: any) => {
                cacheData = data;
                if (cacheData) {
                    this.addCacheData(cacheData, cacheEntryKey, cacheKey);
                }
                return data;
            });
        } else {
            cacheData = ret;
            this.addCacheData(cacheData, cacheEntryKey, cacheKey);
        }


        return ret;
    }

    private addCacheData(cacheData: any, cacheEntryKey: string, cacheKey: string) {
        if (cacheData) {
            let cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheData);
            if ("undefined" == typeof this.cache[cacheKey]) {
                this.cache[cacheKey] = {};
            }
            this.cache[cacheKey][cacheEntryKey] = cacheEntry;
            this.dropOldest(cacheKey);
        }
    }

    private dropOldest(cacheKey: string) {
        let cacheConfig = this.cacheConfigs[cacheKey];
        let oldestKey: string = "";
        let oldestTime: number = -1;
        if (cacheConfig.maxCacheSize > 0 && Object.keys(this.cache[cacheKey]).length > cacheConfig.maxCacheSize) {
            for (let key in this.cache[cacheKey]) {
                let cacheEntry = this.cache[cacheKey][key];
                if (oldestTime == -1 || oldestTime > cacheEntry.lastRefresh) {
                    oldestTime = cacheEntry.lastRefresh;
                    oldestKey = key;
                }
            }
            delete this.cache[cacheKey][oldestKey];
        }
    }

    getFromCache(cacheKey: string, cacheEntryKey: string): any {
        if (!this.hasEntry(cacheKey, cacheEntryKey)) {
            return null;
        }
        this.touch(cacheKey, cacheEntryKey);
        let ret = this.cache[cacheKey][cacheEntryKey];
        if(ret.promise) {
            var $injector = (<any>window).angular.injector(['ng']);

            let $q: any = $injector.get("$q");
            let $timeout: any = $injector.get("$timeout");
            let defer = $q.defer();
            $timeout(()=>{
                defer.resolve(ret.data);
            });
            return defer.promise;
        }

        return ret.data;
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
        return this.cache[cacheKey] && this.cache[cacheKey][cacheEntryKey];
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
        //delete this.cacheConfigs[cacheKey];
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

        let cls: any = class GenericModule extends constructor {

        }
        cls.prototype.__cache_config__ = options;

        for(var key in (<any>constructor).prototype["__cache_decorations__"]) {
            cls.prototype[key] = constructor.prototype.__cache_decorations__[key];
        }
        delete (<any>constructor).prototype["__cache_decorations__"];
        
        return cls;
    }
}


let getCacheKey = function (target: any, key?: string, propertyName?: string) {
    let parentCacheConfig =  target.__cache_config__;
    let cacheKey = ((key != "none") ? key : null) || (parentCacheConfig ? parentCacheConfig.key : null) || propertyName; //TODO prop descriptor????
    return cacheKey;
};

/*
 * Decorators
 */
export function CachePut(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target[propertyName];

        target.__cache_decorations__ = target.__cache_decorations__ || {};
        target.__cache_decorations__[propertyName] = function () {


            let cacheKey = getCacheKey(this, key || "none", propertyName);
            let cacheEntryKey = propertyName + "_" + stringify(arguments);

            let ret = oldFunc.apply(this, arguments);
            if("undefined" != typeof ret) {
                ret = systemCache.putCache(cacheKey, cacheEntryKey, ret);
            }
            return ret;
        }
    }
}

export function Cacheable(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target[propertyName];
        target.__cache_decorations__ = target.__cache_decorations__ || {};

        target.__cache_decorations__[propertyName] = function () {

            let cacheEntryKey = propertyName + "_" + stringify(arguments);
            let cacheKey = getCacheKey(this, key || "none", propertyName);

            let cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
            if (cached) {
                return cached;
            }
            let ret = oldFunc.apply(this, arguments);
            if("undefined" != typeof ret) {
                ret = systemCache.putCache(cacheKey, cacheEntryKey, ret);
            }
            return ret;
        }
    }
}

export function CacheEvict(key?: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        var oldFunc = target.constructor.prototype[propertyName];
        target.__cache_decorations__ = target.__cache_decorations__ || {};
        target.__cache_decorations__[propertyName] = function () {
            let cacheKey = getCacheKey(this, key || "none", propertyName);

            systemCache.clearCache(cacheKey);

            return oldFunc.apply(this, oldFunc);
        }
    }
}




