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

import {AngularCtor} from "./TinyDecorations";


declare var Promise: any;

/**
 * Cache... cache annotation similar to what spring-cache provides
 * on the java side.
 *
 * Note for the time being only a ram cache is implemented
 * a storage cache might be added in the future, however a storage
 * cache is problematic because it takes away from the storage
 * limit of applications, so I am undecided yet whether this
 * is worth it.
 */

//@Cached
//@CachePut
//@CacheEvict
//@Cached

const TEN_MINUTES = 10 * 60 * 1000;

export class CacheConfigOptions {
    key: string;
    evictionPeriod: number;
    refreshOnAccess: boolean;
    maxCacheSize: number;

    constructor(key: string, evictionPeriod: number, refreshOnAccess: boolean, maxCacheSize = -1) {
        this.key = key;
        this.evictionPeriod = evictionPeriod;

        this.refreshOnAccess = refreshOnAccess;
        this.maxCacheSize = maxCacheSize;
    }
}

export interface ILruElement {
    lastRefresh: number;
    key: string;
}

export class CacheEntry implements ILruElement {
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


/**
 * a specialized lru map which allows you to
 * handle size limited caches
 */
export class LruMap<T extends ILruElement> {

    private cacheMap: {[key: string]: T} = {};
    private overFlowArr: Array<T> = [];


    constructor(private maxNoElements = -1) {

    }

    get(key: string): T {
        return this.cacheMap[key];
    }


    put(key: string, element: T) {
        if(!this.cacheMap[key]) {
            this.overFlowArr.push(element);
        }
        this.cacheMap[key] = element;
    }

    hasKey(key: string) {
        return !!this.cacheMap[key];
    }

    get oldestElement(): T | null {
        if(!this.overFlowArr.length) {
            return null;
        }
        this.lruSort();
        return this.overFlowArr[0];
    }

    get length(): number {
        return this.overFlowArr.length;
    }

    get keys(): Array<string> {
        return Object.keys(this.cacheMap);
    }

    remove(key: string) {
        let element = this.cacheMap[key];
        if(element) {
            delete this.cacheMap[key];
            let index = this.overFlowArr.indexOf(element);
            if(index != -1) {
                this.overFlowArr.splice(index, 1)
            }
        }
    }

    /**
     * the lru map does not trim on insert automatically
     * instead a manual trim must be performed for performance
     * reasons (trim is a heavy command)
     * to avoid to many calls to this methoid
     */
    trim() {
        if(this.maxNoElements == -1) {
            return;
        }

        this.lruSort();

        let diffLength = this.overFlowArr.length - this.maxNoElements;

        for(var cnt = 0; cnt < diffLength; cnt++) {
            let overflowingElement = <T> this.overFlowArr.shift();
            delete this.cacheMap[overflowingElement.key];
        }
    }

    private lruSort() {
        this.overFlowArr.sort((a: T, b: T) => {
            return a.lastRefresh - b.lastRefresh;
        });
    }

    clear() {
        this.overFlowArr = [];
        this.cacheMap = {};
    }
}

let stringify = function (args: any) {
    return JSON.stringify([].slice.call(<any>args).slice(0, args.length));
};


export class SystemCache {
    cacheConfigs: { [key: string]: CacheConfigOptions } = {};
    evictionIntervals: { [key: string]: any } = {};
    cache: { [key: string]: LruMap<CacheEntry> } = {};

    initCache(opts: CacheConfigOptions) {
        //central gc routine, it performs a mark and sweep on the cache entries
        if (this.evictionIntervals[opts.key]) {
            return;
        }
        this.evictionIntervals[opts.key] = setInterval(() => {
            //this.cache[opts.key] = {};
            let purge: Array<string> = [];
            for (var cnt = 0; cnt <  this.cache[opts.key].keys.length; cnt++) {
                let key = this.cache[opts.key].keys[cnt];
                let entry = this.cache[opts.key].get(key);
                let refresTimestamp = entry.lastRefresh + opts.evictionPeriod;
                let curr = new Date().getTime();

                if ( refresTimestamp <= curr) { //eviction point started
                    purge.push(key);
                }
            }
            for (let cnt = 0; cnt < purge.length; cnt++) {
                this.cache[opts.key].remove(purge[cnt]);
            }

            if (!this.cache[opts.key] || !this.cache[opts.key].keys.length) {
                clearInterval(this.evictionIntervals[opts.key]);
                delete this.evictionIntervals[opts.key];
            }
        }, opts.evictionPeriod);
    }

    putCache(cacheKey: string, cacheEntryKey: string, ret: any, maxNoElements: number) {
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
                    this.addCacheData(cacheData, cacheEntryKey, cacheKey, maxNoElements);
                }
                return data;
            });
        } else {
            cacheData = ret;
            this.addCacheData(cacheData, cacheEntryKey, cacheKey, maxNoElements);
        }


        return ret;
    }

    private addCacheData(cacheData: any, cacheEntryKey: string, cacheKey: string, maxNoElements: number) {
        if (cacheData) {
            let cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheData);
            if ("undefined" == typeof this.cache[cacheKey]) {
                this.cache[cacheKey] = new LruMap<CacheEntry>(maxNoElements);
            }
            this.cache[cacheKey].put(cacheEntryKey, cacheEntry);
            this.cache[cacheKey].trim();
        }
    }



    getFromCache(cacheKey: string, cacheEntryKey: string): any {
        if (!this.hasEntry(cacheKey, cacheEntryKey)) {
            return null;
        }
        this.touch(cacheKey, cacheEntryKey);
        let ret = this.cache[cacheKey].get(cacheEntryKey);
        if(ret.promise) {
            if(!!(<any>window).angular) { //angular subsystem with its own promises
                var $injector = (<any>window).angular.injector(['ng']);

                let $q: any = $injector.get("$q");
                let $timeout: any = $injector.get("$timeout");
                let defer = $q.defer();
                $timeout(()=>{
                    defer.resolve(ret.data);
                });
                return defer.promise;
            } else {    //standard promises, if no angular1 is present
                return new Promise(
                    // Resolver-Funktion kann den Promise sowohl auflösen als auch verwerfen
                    // reject the promise
                    function(resolve: Function, reject: Function) {

                        setTimeout(() => {
                            resolve(ret.data);
                        }, 0);
                    });
            }

        }

        return ret.data;
    }

    touch(cacheKey: string, cacheEntryKey?: string) {

        if (!this.cacheConfigs[cacheKey] || !this.cache[cacheKey]) {
            return;
        }
        let refreshOnAccess = this.cacheConfigs[cacheKey].refreshOnAccess;


        if (cacheEntryKey) {
            if (!this.cache[cacheKey].hasKey(cacheEntryKey)) {
                return;
            }
            if (refreshOnAccess) {
                this.cache[cacheKey].get(cacheEntryKey).lastRefresh = new Date().getTime();
                return;
            }

        } else {
            for (var cnt = 0; cnt <  this.cache[cacheKey].keys.length; cnt++) {
                if (refreshOnAccess) {
                    let key = this.cache[cacheKey].keys[cnt];
                    this.cache[cacheKey].get(key).lastRefresh = new Date().getTime();
                }
            }
        }
    }

    hasEntry(cacheKey: string, cacheEntryKey: string) {
        return this.cache[cacheKey] && this.cache[cacheKey].hasKey(cacheEntryKey);
    }

    clearCache(cacheKey: string, cacheEntry ?: string) {
        if (!this.cacheConfigs[cacheKey]) {
            return;
        }
        if (cacheEntry) {
            this.cache[cacheKey].remove(cacheEntry);
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


export function Cached(options: CacheConfigOptions | string) {
    if ("string" == typeof options || options instanceof String) {
        options =  systemCache.cacheConfigs[<string>options] || new CacheConfigOptions(<string> options, TEN_MINUTES, true);
    }
    var opts = <CacheConfigOptions> options;
    systemCache.cacheConfigs[opts.key] = opts;


    return (ctor: AngularCtor<Object>): any => {

        let cls: any = class GenericCacheModule extends ctor {
            constructor() {
                //We have a $resource as first argument
                super(...[].slice.call(<any>arguments).slice(0, arguments.length));
            }
        }
        cls.prototype.__cache_config__ = options;

        for(var key in (<any>ctor).prototype["__cache_decorations__"]) {

            cls.prototype[key] = ctor.prototype.__cache_decorations__[key];
        }
        delete (<any>ctor).prototype["__cache_decorations__"];
        
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
                ret = systemCache.putCache(cacheKey, cacheEntryKey, ret, this.__cache_config__.maxCacheSize);
            }
            return ret;
        }
        target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];

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
                ret = systemCache.putCache(cacheKey, cacheEntryKey, ret, this.__cache_config__.maxCacheSize);
            }
            return ret;
        };
        target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];
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
        target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];

    }
}




