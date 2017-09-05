/**
 * Decorations which provide extended functionality outside
 * of what angular has per default
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
     */
    //@Cacheable
    //@CachePut
    //@CacheEvict
    //@CacheConfig
    var TEN_MINUTES = 10 * 60 * 1000;
    var CacheConfigOptions = (function () {
        function CacheConfigOptions(key, evicitionPeriod, refreshOnAccess) {
            this.key = key;
            this.evicitionPeriod = evicitionPeriod;
            this.refreshOnAccess = refreshOnAccess;
        }
        return CacheConfigOptions;
    }());
    exports.CacheConfigOptions = CacheConfigOptions;
    var CacheEntry = (function () {
        function CacheEntry(key, lastRefresh, data) {
            this.key = key;
            this.lastRefresh = lastRefresh;
            this.data = data;
        }
        return CacheEntry;
    }());
    exports.CacheEntry = CacheEntry;
    var stringify = function (args) {
        return JSON.stringify([].slice.call(args).slice(0, args.length));
    };
    var SystemCache = (function () {
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
                    var refresTimestamp = entry.lastRefresh + opts.evicitionPeriod;
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
            }, opts.evicitionPeriod);
        };
        SystemCache.prototype.putCache = function (cacheKey, cacheEntryKey, ret) {
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
                    return data;
                });
            }
            else {
                cacheData = ret;
            }
            if (cacheData) {
                var cacheEntry = new CacheEntry(cacheEntryKey, new Date().getTime(), ret);
                if ("undefined" == typeof this.cache[cacheKey]) {
                    this.cache[cacheKey] = {};
                }
                this.cache[cacheKey][cacheEntryKey] = cacheEntry;
            }
        };
        SystemCache.prototype.getFromCache = function (cacheKey, cacheEntryKey) {
            if (!this.hasEntry(cacheKey, cacheEntryKey)) {
                return null;
            }
            this.touch(cacheKey, cacheEntryKey);
            return this.cache[cacheKey][cacheEntryKey].data;
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
                    console.log(this.cache[cacheKey][cacheEntryKey].lastRefresh);
                    console.log("--" + new Date().getTime());
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
    exports.SystemCache = SystemCache;
    exports.systemCache = new SystemCache();
    function CacheConfig(options) {
        if ("string" == typeof options || options instanceof String) {
            options = new CacheConfigOptions(options, TEN_MINUTES, true);
        }
        var opts = options;
        exports.systemCache.cacheConfigs[opts.key] = opts;
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
    exports.CacheConfig = CacheConfig;
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
                    exports.systemCache.putCache(cacheKey, cacheEntryKey, ret);
                }
                return ret;
            };
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
                    exports.systemCache.putCache(cacheKey, cacheEntryKey, ret);
                }
                return ret;
            };
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
        };
    }
    exports.CacheEvict = CacheEvict;
});
//# sourceMappingURL=ExtendedDecorations.js.map