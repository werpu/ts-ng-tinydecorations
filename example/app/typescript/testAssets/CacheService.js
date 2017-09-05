System.register(["TinyDecorations", "ExtendedDecorations"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations_1, ExtendedDecorations_1, STANDARD_CACHE_KEY, EVICTION_TIME, CacheService;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            },
            function (ExtendedDecorations_1_1) {
                ExtendedDecorations_1 = ExtendedDecorations_1_1;
            }
        ],
        execute: function () {
            exports_1("STANDARD_CACHE_KEY", STANDARD_CACHE_KEY = "StandardCache");
            exports_1("EVICTION_TIME", EVICTION_TIME = 10 * 1000);
            CacheService = (function () {
                function CacheService() {
                    this.cacheableCallCnt = 0;
                }
                CacheService.prototype.basicPut = function (instr) {
                    this.basicPutValue = instr;
                    return instr;
                };
                CacheService.prototype.cacheable = function (instr) {
                    this.cacheableCallCnt++;
                    this.cacheablePutVale = instr;
                    return instr;
                };
                CacheService.prototype.cacheable2 = function (instr) {
                    this.cacheableCallCnt++;
                    this.cacheablePutVale = instr;
                    return instr;
                };
                CacheService.prototype.cacheEvict = function () {
                };
                __decorate([
                    ExtendedDecorations_1.CachePut(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "basicPut", null);
                __decorate([
                    ExtendedDecorations_1.Cacheable(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "cacheable", null);
                __decorate([
                    ExtendedDecorations_1.Cacheable(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], CacheService.prototype, "cacheable2", null);
                __decorate([
                    ExtendedDecorations_1.CacheEvict(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], CacheService.prototype, "cacheEvict", null);
                CacheService = __decorate([
                    TinyDecorations_1.Injectable("CacheService"),
                    ExtendedDecorations_1.CacheConfig({
                        key: STANDARD_CACHE_KEY,
                        evicitionPeriod: EVICTION_TIME,
                        refreshOnAccess: true
                    }),
                    __metadata("design:paramtypes", [])
                ], CacheService);
                return CacheService;
            }());
            exports_1("CacheService", CacheService);
        }
    };
});
//# sourceMappingURL=CacheService.js.map