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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var TEN_MINUTES = 10 * 60 * 1000;
    var CacheConfigOptions = /** @class */ (function () {
        function CacheConfigOptions(key, evictionPeriod, refreshOnAccess, maxCacheSize) {
            if (maxCacheSize === void 0) { maxCacheSize = -1; }
            this.key = key;
            this.evictionPeriod = evictionPeriod;
            this.refreshOnAccess = refreshOnAccess;
            this.maxCacheSize = maxCacheSize;
        }
        return CacheConfigOptions;
    }());
    exports.CacheConfigOptions = CacheConfigOptions;
    var CacheEntry = /** @class */ (function () {
        function CacheEntry(key, lastRefresh, data, promise) {
            if (promise === void 0) { promise = false; }
            this.key = key;
            this.lastRefresh = lastRefresh;
            this.data = data;
            this.promise = promise;
        }
        return CacheEntry;
    }());
    exports.CacheEntry = CacheEntry;
    /**
     * a specialized lru map which allows you to
     * handle size limited caches
     */
    var LruMap = /** @class */ (function () {
        function LruMap(maxNoElements) {
            if (maxNoElements === void 0) { maxNoElements = -1; }
            this.maxNoElements = maxNoElements;
            this.cacheMap = {};
            this.overFlowArr = [];
        }
        LruMap.prototype.get = function (key) {
            return this.cacheMap[key];
        };
        LruMap.prototype.put = function (key, element) {
            if (!this.cacheMap[key]) {
                this.overFlowArr.push(element);
            }
            this.cacheMap[key] = element;
        };
        LruMap.prototype.hasKey = function (key) {
            return !!this.cacheMap[key];
        };
        Object.defineProperty(LruMap.prototype, "oldestElement", {
            get: function () {
                if (!this.overFlowArr.length) {
                    return null;
                }
                this.lruSort();
                return this.overFlowArr[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LruMap.prototype, "length", {
            get: function () {
                return this.overFlowArr.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LruMap.prototype, "keys", {
            get: function () {
                return Object.keys(this.cacheMap);
            },
            enumerable: true,
            configurable: true
        });
        LruMap.prototype.remove = function (key) {
            var element = this.cacheMap[key];
            if (element) {
                delete this.cacheMap[key];
                var index = this.overFlowArr.indexOf(element);
                if (index != -1) {
                    this.overFlowArr.splice(index, 1);
                }
            }
        };
        /**
         * the lru map does not trim on insert automatically
         * instead a manual trim must be performed for performance
         * reasons (trim is a heavy command)
         * to avoid to many calls to this methoid
         */
        LruMap.prototype.trim = function () {
            if (this.maxNoElements == -1) {
                return;
            }
            this.lruSort();
            var diffLength = this.overFlowArr.length - this.maxNoElements;
            for (var cnt = 0; cnt < diffLength; cnt++) {
                var overflowingElement = this.overFlowArr.shift();
                delete this.cacheMap[overflowingElement.key];
            }
        };
        LruMap.prototype.lruSort = function () {
            this.overFlowArr.sort(function (a, b) {
                return a.lastRefresh - b.lastRefresh;
            });
        };
        LruMap.prototype.clear = function () {
            this.overFlowArr = [];
            this.cacheMap = {};
        };
        return LruMap;
    }());
    exports.LruMap = LruMap;
    var stringify = function (args) {
        return JSON.stringify([].slice.call(args).slice(0, args.length));
    };
    var SystemCache = /** @class */ (function () {
        function SystemCache() {
            this.cacheConfigs = {};
            this.evictionIntervals = {};
            this.cache = {};
        }
        SystemCache.prototype.initCache = function (opts) {
            var _this = this;
            //central gc routine, it performs a mark and sweep on the cache entries
            if (this.evictionIntervals[opts.key]) {
                return;
            }
            this.evictionIntervals[opts.key] = setInterval(function () {
                //this.cache[opts.key] = {};
                var purge = [];
                for (var cnt = 0; cnt < _this.cache[opts.key].keys.length; cnt++) {
                    var key = _this.cache[opts.key].keys[cnt];
                    var entry = _this.cache[opts.key].get(key);
                    var refresTimestamp = entry.lastRefresh + opts.evictionPeriod;
                    var curr = new Date().getTime();
                    if (refresTimestamp <= curr) { //eviction point started
                        purge.push(key);
                    }
                }
                for (var cnt_1 = 0; cnt_1 < purge.length; cnt_1++) {
                    _this.cache[opts.key].remove(purge[cnt_1]);
                }
                if (!_this.cache[opts.key] || !_this.cache[opts.key].keys.length) {
                    clearInterval(_this.evictionIntervals[opts.key]);
                    delete _this.evictionIntervals[opts.key];
                }
            }, opts.evictionPeriod);
        };
        SystemCache.prototype.putCache = function (cacheKey, cacheEntryKey, ret, maxNoElements) {
            var _this = this;
            var cacheConfig = this.cacheConfigs[cacheKey];
            if (!cacheConfig) {
                cacheConfig = new CacheConfigOptions(cacheKey, TEN_MINUTES, true);
            }
            this.initCache(cacheConfig);
            //asynchronous ret?
            var cacheData = null;
            if (!!(ret && ret.then)) {
                ret.then(function (data) {
                    cacheData = data;
                    if (cacheData) {
                        _this.addCacheData(cacheData, cacheEntryKey, cacheKey, maxNoElements);
                    }
                    return data;
                });
            }
            else {
                cacheData = ret;
                this.addCacheData(cacheData, cacheEntryKey, cacheKey, maxNoElements);
            }
            return ret;
        };
        SystemCache.prototype.addCacheData = function (cacheData, cacheEntryKey, cacheKey, maxNoElements) {
            if (cacheData) {
                var cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheData);
                if ("undefined" == typeof this.cache[cacheKey]) {
                    this.cache[cacheKey] = new LruMap(maxNoElements);
                }
                this.cache[cacheKey].put(cacheEntryKey, cacheEntry);
                this.cache[cacheKey].trim();
            }
        };
        SystemCache.prototype.getFromCache = function (cacheKey, cacheEntryKey) {
            if (!this.hasEntry(cacheKey, cacheEntryKey)) {
                return null;
            }
            this.touch(cacheKey, cacheEntryKey);
            var ret = this.cache[cacheKey].get(cacheEntryKey);
            if (ret.promise) {
                if (!!window.angular) { //angular subsystem with its own promises
                    var $injector = window.angular.injector(['ng']);
                    var $q = $injector.get("$q");
                    var $timeout = $injector.get("$timeout");
                    var defer_1 = $q.defer();
                    $timeout(function () {
                        defer_1.resolve(ret.data);
                    });
                    return defer_1.promise;
                }
                else { //standard promises, if no angular1 is present
                    return new Promise(
                    // Resolver-Funktion kann den Promise sowohl auflösen als auch verwerfen
                    // reject the promise
                    function (resolve, reject) {
                        setTimeout(function () {
                            resolve(ret.data);
                        }, 0);
                    });
                }
            }
            return ret.data;
        };
        SystemCache.prototype.touch = function (cacheKey, cacheEntryKey) {
            if (!this.cacheConfigs[cacheKey] || !this.cache[cacheKey]) {
                return;
            }
            var refreshOnAccess = this.cacheConfigs[cacheKey].refreshOnAccess;
            if (cacheEntryKey) {
                if (!this.cache[cacheKey].hasKey(cacheEntryKey)) {
                    return;
                }
                if (refreshOnAccess) {
                    this.cache[cacheKey].get(cacheEntryKey).lastRefresh = new Date().getTime();
                    return;
                }
            }
            else {
                for (var cnt = 0; cnt < this.cache[cacheKey].keys.length; cnt++) {
                    if (refreshOnAccess) {
                        var key = this.cache[cacheKey].keys[cnt];
                        this.cache[cacheKey].get(key).lastRefresh = new Date().getTime();
                    }
                }
            }
        };
        SystemCache.prototype.hasEntry = function (cacheKey, cacheEntryKey) {
            return this.cache[cacheKey] && this.cache[cacheKey].hasKey(cacheEntryKey);
        };
        SystemCache.prototype.clearCache = function (cacheKey, cacheEntry) {
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
        };
        return SystemCache;
    }());
    exports.SystemCache = SystemCache;
    exports.systemCache = new SystemCache();
    function Cached(options) {
        if ("string" == typeof options || options instanceof String) {
            options = exports.systemCache.cacheConfigs[options] || new CacheConfigOptions(options, TEN_MINUTES, true);
        }
        var opts = options;
        exports.systemCache.cacheConfigs[opts.key] = opts;
        return function (ctor) {
            var cls = /** @class */ (function (_super) {
                __extends(GenericCacheModule, _super);
                function GenericCacheModule() {
                    return _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                }
                return GenericCacheModule;
            }(ctor));
            cls.prototype.__cache_config__ = options;
            for (var key in ctor.prototype["__cache_decorations__"]) {
                cls.prototype[key] = ctor.prototype.__cache_decorations__[key];
            }
            delete ctor.prototype["__cache_decorations__"];
            return cls;
        };
    }
    exports.Cached = Cached;
    var getCacheKey = function (target, key, propertyName) {
        var parentCacheConfig = target.__cache_config__;
        var cacheKey = ((key != "none") ? key : null) || (parentCacheConfig ? parentCacheConfig.key : null) || propertyName; //TODO prop descriptor????
        return cacheKey;
    };
    /*
     * Decorators
     */
    function CachePut(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.__cache_decorations__ = target.__cache_decorations__ || {};
            target.__cache_decorations__[propertyName] = function () {
                var cacheKey = getCacheKey(this, key || "none", propertyName);
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var ret = oldFunc.apply(this, arguments);
                if ("undefined" != typeof ret) {
                    ret = exports.systemCache.putCache(cacheKey, cacheEntryKey, ret, this.__cache_config__.maxCacheSize);
                }
                return ret;
            };
            target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];
        };
    }
    exports.CachePut = CachePut;
    function Cacheable(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.__cache_decorations__ = target.__cache_decorations__ || {};
            target.__cache_decorations__[propertyName] = function () {
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var cacheKey = getCacheKey(this, key || "none", propertyName);
                var cached = exports.systemCache.getFromCache(cacheKey, cacheEntryKey);
                if (cached) {
                    return cached;
                }
                var ret = oldFunc.apply(this, arguments);
                if ("undefined" != typeof ret) {
                    ret = exports.systemCache.putCache(cacheKey, cacheEntryKey, ret, this.__cache_config__.maxCacheSize);
                }
                return ret;
            };
            target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];
        };
    }
    exports.Cacheable = Cacheable;
    function CacheEvict(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target.constructor.prototype[propertyName];
            target.__cache_decorations__ = target.__cache_decorations__ || {};
            target.__cache_decorations__[propertyName] = function () {
                var cacheKey = getCacheKey(this, key || "none", propertyName);
                exports.systemCache.clearCache(cacheKey);
                return oldFunc.apply(this, oldFunc);
            };
            target.__cache_decorations__[propertyName]["__request_meta__"] = target[propertyName]["__request_meta__"];
        };
    }
    exports.CacheEvict = CacheEvict;
});
//# sourceMappingURL=Cache.js.map