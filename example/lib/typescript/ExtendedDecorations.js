/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */
System.register([], function (exports_1, context_1) {
    "use strict";
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
    var __moduleName = context_1 && context_1.id;
    function Cached(options) {
        if ("string" == typeof options || options instanceof String) {
            options = systemCache.cacheConfigs[options] || new CacheConfigOptions(options, TEN_MINUTES, true);
        }
        var opts = options;
        systemCache.cacheConfigs[opts.key] = opts;
        return function (constructor) {
            var cls = (function (_super) {
                __extends(GenericModule, _super);
                function GenericModule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return GenericModule;
            }(constructor));
            cls.prototype.__cache_config__ = options;
            for (var key in constructor.prototype["__cache_decorations__"]) {
                cls.prototype[key] = constructor.prototype.__cache_decorations__[key];
            }
            delete constructor.prototype["__cache_decorations__"];
            return cls;
        };
    }
    exports_1("Cached", Cached);
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
                    ret = systemCache.putCache(cacheKey, cacheEntryKey, ret);
                }
                return ret;
            };
        };
    }
    exports_1("CachePut", CachePut);
    function Cacheable(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.__cache_decorations__ = target.__cache_decorations__ || {};
            target.__cache_decorations__[propertyName] = function () {
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var cacheKey = getCacheKey(this, key || "none", propertyName);
                var cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
                if (cached) {
                    return cached;
                }
                var ret = oldFunc.apply(this, arguments);
                if ("undefined" != typeof ret) {
                    ret = systemCache.putCache(cacheKey, cacheEntryKey, ret);
                }
                return ret;
            };
        };
    }
    exports_1("Cacheable", Cacheable);
    function CacheEvict(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target.constructor.prototype[propertyName];
            target.__cache_decorations__ = target.__cache_decorations__ || {};
            target.__cache_decorations__[propertyName] = function () {
                var cacheKey = getCacheKey(this, key || "none", propertyName);
                systemCache.clearCache(cacheKey);
                return oldFunc.apply(this, oldFunc);
            };
        };
    }
    exports_1("CacheEvict", CacheEvict);
    var TEN_MINUTES, CacheConfigOptions, CacheEntry, stringify, SystemCache, systemCache, getCacheKey;
    return {
        setters: [],
        execute: function () {
            /**
             * Cache... cache annotation similar to what spring-cache provides
             * on the java side.
             */
            //@Cached
            //@CachePut
            //@CacheEvict
            //@Cached
            TEN_MINUTES = 10 * 60 * 1000;
            CacheConfigOptions = (function () {
                function CacheConfigOptions(key, evictionPeriod, refreshOnAccess, maxCacheSize) {
                    if (maxCacheSize === void 0) { maxCacheSize = -1; }
                    this.key = key;
                    this.evictionPeriod = evictionPeriod;
                    this.refreshOnAccess = refreshOnAccess;
                    this.maxCacheSize = maxCacheSize;
                }
                return CacheConfigOptions;
            }());
            exports_1("CacheConfigOptions", CacheConfigOptions);
            CacheEntry = (function () {
                function CacheEntry(key, lastRefresh, data, promise) {
                    if (promise === void 0) { promise = false; }
                    this.key = key;
                    this.lastRefresh = lastRefresh;
                    this.data = data;
                    this.promise = promise;
                }
                return CacheEntry;
            }());
            exports_1("CacheEntry", CacheEntry);
            stringify = function (args) {
                return JSON.stringify([].slice.call(args).slice(0, args.length));
            };
            SystemCache = (function () {
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
                        for (var key in _this.cache[opts.key]) {
                            var entry = _this.cache[opts.key][key];
                            var refresTimestamp = entry.lastRefresh + opts.evictionPeriod;
                            var curr = new Date().getTime();
                            if (refresTimestamp <= curr) {
                                purge.push(key);
                            }
                        }
                        for (var cnt = 0; cnt < purge.length; cnt++) {
                            delete _this.cache[opts.key][purge[cnt]];
                        }
                        if (!_this.cache[opts.key] || !Object.keys(_this.cache[opts.key]).length) {
                            clearInterval(_this.evictionIntervals[opts.key]);
                            delete _this.evictionIntervals[opts.key];
                        }
                    }, opts.evictionPeriod);
                };
                SystemCache.prototype.putCache = function (cacheKey, cacheEntryKey, ret) {
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
                                _this.addCacheData(cacheData, cacheEntryKey, cacheKey);
                            }
                            return data;
                        });
                    }
                    else {
                        cacheData = ret;
                        this.addCacheData(cacheData, cacheEntryKey, cacheKey);
                    }
                    return ret;
                };
                SystemCache.prototype.addCacheData = function (cacheData, cacheEntryKey, cacheKey) {
                    if (cacheData) {
                        var cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheData);
                        if ("undefined" == typeof this.cache[cacheKey]) {
                            this.cache[cacheKey] = {};
                        }
                        this.cache[cacheKey][cacheEntryKey] = cacheEntry;
                        this.dropOldest(cacheKey);
                    }
                };
                SystemCache.prototype.dropOldest = function (cacheKey) {
                    var cacheConfig = this.cacheConfigs[cacheKey];
                    var oldestKey = "";
                    var oldestTime = -1;
                    if (cacheConfig.maxCacheSize > 0 && Object.keys(this.cache[cacheKey]).length > cacheConfig.maxCacheSize) {
                        for (var key in this.cache[cacheKey]) {
                            var cacheEntry = this.cache[cacheKey][key];
                            if (oldestTime == -1 || oldestTime > cacheEntry.lastRefresh) {
                                oldestTime = cacheEntry.lastRefresh;
                                oldestKey = key;
                            }
                        }
                        delete this.cache[cacheKey][oldestKey];
                    }
                };
                SystemCache.prototype.getFromCache = function (cacheKey, cacheEntryKey) {
                    if (!this.hasEntry(cacheKey, cacheEntryKey)) {
                        return null;
                    }
                    this.touch(cacheKey, cacheEntryKey);
                    var ret = this.cache[cacheKey][cacheEntryKey];
                    if (ret.promise) {
                        var $injector = window.angular.injector(['ng']);
                        var $q = $injector.get("$q");
                        var $timeout = $injector.get("$timeout");
                        var defer_1 = $q.defer();
                        $timeout(function () {
                            defer_1.resolve(ret.data);
                        });
                        return defer_1.promise;
                    }
                    return ret.data;
                };
                SystemCache.prototype.touch = function (cacheKey, cacheEntryKey) {
                    if (!this.cacheConfigs[cacheKey] || !this.cache[cacheKey]) {
                        return;
                    }
                    var refreshOnAccess = this.cacheConfigs[cacheKey].refreshOnAccess;
                    if (cacheEntryKey) {
                        if (!this.cache[cacheKey][cacheEntryKey]) {
                            return;
                        }
                        if (refreshOnAccess) {
                            this.cache[cacheKey][cacheEntryKey].lastRefresh = new Date().getTime();
                            return;
                        }
                    }
                    else {
                        for (var key in this.cache[cacheKey]) {
                            if (refreshOnAccess) {
                                this.cache[cacheKey][key].lastRefresh = new Date().getTime();
                            }
                        }
                    }
                };
                SystemCache.prototype.hasEntry = function (cacheKey, cacheEntryKey) {
                    return this.cache[cacheKey] && this.cache[cacheKey][cacheEntryKey];
                };
                SystemCache.prototype.clearCache = function (cacheKey, cacheEntry) {
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
                };
                return SystemCache;
            }());
            exports_1("SystemCache", SystemCache);
            exports_1("systemCache", systemCache = new SystemCache());
            getCacheKey = function (target, key, propertyName) {
                var parentCacheConfig = target.__cache_config__;
                var cacheKey = ((key != "none") ? key : null) || (parentCacheConfig ? parentCacheConfig.key : null) || propertyName; //TODO prop descriptor????
                return cacheKey;
            };
        }
    };
});
//# sourceMappingURL=ExtendedDecorations.js.map