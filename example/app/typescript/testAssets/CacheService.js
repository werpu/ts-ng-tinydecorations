System.register(["TinyDecorations", "Cache"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations_1, Cache_1, Restable, Rest, STANDARD_CACHE_KEY, EVICTION_TIME, CacheService;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            },
            function (Cache_1_1) {
                Cache_1 = Cache_1_1;
            }
        ],
        execute: function () {
            Restable = TinyDecorations_1.extended.Restable;
            Rest = TinyDecorations_1.extended.Rest;
            exports_1("STANDARD_CACHE_KEY", STANDARD_CACHE_KEY = "StandardCache");
            exports_1("EVICTION_TIME", EVICTION_TIME = 10 * 1000);
            CacheService = (function () {
                function CacheService($q, $timeout) {
                    this.$q = $q;
                    this.$timeout = $timeout;
                    this.cacheableCallCnt = 0;
                }
                CacheService.prototype.theCachedReq = function (instr) {
                };
                CacheService.prototype.basicPut = function (instr) {
                    this.basicPutValue = instr;
                    return instr;
                };
                CacheService.prototype.basicPutPromise = function (instr) {
                    var deferred = this.$q.defer();
                    this.basicPutValue = instr;
                    deferred.resolve(instr);
                    return deferred.promise;
                };
                CacheService.prototype.cacheable = function (instr) {
                    this.cacheableCallCnt++;
                    this.cacheablePutVale = instr;
                    return instr;
                };
                CacheService.prototype.cacheablePromise = function (instr) {
                    var deferred = this.$q.defer();
                    this.cacheableCallCnt++;
                    this.cacheablePutVale = instr;
                    deferred.resolve(instr);
                    return deferred.promise;
                };
                CacheService.prototype.cacheable2 = function (instr) {
                    this.cacheableCallCnt++;
                    this.cacheablePutVale = instr;
                    return instr;
                };
                CacheService.prototype.cacheEvict = function () {
                };
                __decorate([
                    Cache_1.CachePut(),
                    Rest({
                        url: "/myRequest",
                        method: TinyDecorations_1.REST_TYPE.GET,
                        decorator: function (inPromise) {
                            this.__decoratorcalled__ = true;
                            return inPromise.$promise;
                        }
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", Object)
                ], CacheService.prototype, "theCachedReq", null);
                __decorate([
                    Cache_1.CachePut(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "basicPut", null);
                __decorate([
                    Cache_1.CachePut(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", Object)
                ], CacheService.prototype, "basicPutPromise", null);
                __decorate([
                    Cache_1.Cacheable(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "cacheable", null);
                __decorate([
                    Cache_1.Cacheable(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", Object)
                ], CacheService.prototype, "cacheablePromise", null);
                __decorate([
                    Cache_1.Cacheable(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "cacheable2", null);
                __decorate([
                    Cache_1.CacheEvict(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], CacheService.prototype, "cacheEvict", null);
                CacheService = __decorate([
                    TinyDecorations_1.Injectable("CacheService"),
                    Cache_1.Cached({
                        key: STANDARD_CACHE_KEY,
                        evictionPeriod: EVICTION_TIME,
                        refreshOnAccess: true
                    }),
                    Restable({
                        $rootUrl: "rootUrl"
                    }),
                    __param(0, TinyDecorations_1.Inject("$q")), __param(1, TinyDecorations_1.Inject("$timeout")),
                    __metadata("design:paramtypes", [Function, Function])
                ], CacheService);
                return CacheService;
            }());
            exports_1("CacheService", CacheService);
        }
    };
});
//# sourceMappingURL=CacheService.js.map