/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
 */
System.register(["q"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function CacheConfig(options) {
        if ("string" == typeof options || options instanceof String) {
            options = new CacheConfigOptions(options, TEN_MINUTES, true);
        }
        var opts = options;
        systemCache.cacheConfigs[opts.key] = opts;
        return function (constructor) {
            constructor.prototype.__cache_config__ = options;
            return constructor;
        };
    }
    exports_1("CacheConfig", CacheConfig);
    /*
     * Decorators
     */
    function CachePut(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.prototype[propertyName] = function () {
                var cacheKey = key || propertyName; //TODO prop descriptor????
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var ret = oldFunc.apply(this, oldFunc);
                systemCache.putCache(cacheKey, cacheEntryKey, ret);
                return ret;
            };
        };
    }
    exports_1("CachePut", CachePut);
    function Cacheable(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.prototype[propertyName] = function () {
                var cacheKey = key || propertyName; //TODO prop descriptor????
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
                if (cached) {
                    return cached;
                }
                var ret = oldFunc.apply(this, oldFunc);
                systemCache.putCache(cacheKey, cacheEntryKey, ret);
                return ret;
            };
        };
    }
    exports_1("Cacheable", Cacheable);
    function CacheEvict(key) {
        return function (target, propertyName, descriptor) {
            var oldFunc = target[propertyName];
            target.prototype[propertyName] = function () {
                var cacheKey = key || propertyName; //TODO prop descriptor????
                var cacheEntryKey = propertyName + "_" + stringify(arguments);
                var cached = systemCache.getFromCache(cacheKey, cacheEntryKey);
                systemCache.clearCache(cacheKey);
                if (cached) {
                    return cached;
                }
                return oldFunc.apply(this, oldFunc);
            };
        };
    }
    exports_1("CacheEvict", CacheEvict);
    var q_1, TEN_MINUTES, CacheConfigOptions, CacheEntry, stringify, SystemCache, systemCache;
    return {
        setters: [
            function (q_1_1) {
                q_1 = q_1_1;
            }
        ],
        execute: function () {
            /**
             * Cache... cache annotation similar to what spring-cache provides
             * on the java side.
             */
            //@Cacheable
            //@CachePut
            //@CacheEvict
            //@Cached
            TEN_MINUTES = 10 * 60 * 1000;
            CacheConfigOptions = (function () {
                function CacheConfigOptions(key, evictionPeriod, refreshOnAccess) {
                    this.key = key;
                    this.evictionPeriod = evictionPeriod;
                    this.refreshOnAccess = refreshOnAccess;
                }
                return CacheConfigOptions;
            }());
            exports_1("CacheConfigOptions", CacheConfigOptions);
            CacheEntry = (function () {
                function CacheEntry(key, lastRefresh, data) {
                    this.key = key;
                    this.lastRefresh = lastRefresh;
                    this.data = data;
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
                }
                SystemCache.prototype.initCache = function (opts) {
                    var _this = this;
                    //central gc routine, it performs a mark and sweep on the cache entries
                    if (this.evictionIntervals[opts.key]) {
                        return;
                    }
                    this.evictionIntervals[opts.key] = setInterval(function () {
                        _this.cache[opts.key] = {};
                        var purge = [];
                        for (var key in _this.cache[opts.key].keys) {
                            var entry = _this.cache[opts.key][key];
                            if ((entry.lastRefresh + opts.evictionPeriod) < new Date().getTime()) {
                                purge.push(key);
                            }
                        }
                        for (var cnt = 0; cnt < purge.length; cnt++) {
                            delete _this.cache[opts.key][purge[cnt]];
                        }
                        if (!_this.cache[opts.key].keys) {
                            clearInterval(_this.evictionIntervals[opts.key]);
                            delete _this.evictionIntervals[opts.key];
                        }
                    }, opts.evictionPeriod);
                };
                SystemCache.prototype.putCache = function (cacheKey, cacheEntryKey, ret) {
                    var cacheConfig = this.cacheConfigs[cacheKey];
                    if (!cacheConfig) {
                        cacheConfig = new CacheConfigOptions(cacheKey, TEN_MINUTES, true);
                    }
                    this.initCache(cacheConfig);
                    //asynchronous ret?
                    var cacheData = null;
                    if (ret instanceof q_1.Promise) {
                        ret.then(function (data) {
                            cacheData = data;
                            return data;
                        });
                    }
                    else {
                        cacheData = ret;
                    }
                    if (cacheData) {
                        var cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), cacheConfig.refreshOnAccess);
                        this.cache[cacheKey][cacheEntryKey] = cacheEntry;
                    }
                };
                SystemCache.prototype.getFromCache = function (cacheKey, cacheEntryKey) {
                    if (this.hasEntry(cacheKey, cacheEntryKey)) {
                        return null;
                    }
                    this.touch(cacheKey, cacheEntryKey);
                    return this.cache[cacheKey][cacheEntryKey];
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
                    return !this.cache[cacheKey] || !this.cache[cacheKey][cacheEntryKey];
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
                    delete this.cacheConfigs[cacheKey];
                    delete this.cache[cacheKey];
                };
                return SystemCache;
            }());
            exports_1("SystemCache", SystemCache);
            exports_1("systemCache", systemCache = new SystemCache());
        }
    };
});
//# sourceMappingURL=ExtendedDecorations.js.map