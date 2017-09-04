System.register(["TinyDecorations", "ExtendedDecorations"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations_1, ExtendedDecorations_1, CacheService;
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
            CacheService = (function () {
                function CacheService() {
                }
                CacheService = __decorate([
                    TinyDecorations_1.Injectable("RestService"),
                    ExtendedDecorations_1.CacheConfig({
                        key: "StandardCache",
                        evicitionPeriod: 10 * 1000,
                        refreshOnAccess: true
                    })
                ], CacheService);
                return CacheService;
            }());
            exports_1("CacheService", CacheService);
        }
    };
});
//# sourceMappingURL=CacheService.js.map