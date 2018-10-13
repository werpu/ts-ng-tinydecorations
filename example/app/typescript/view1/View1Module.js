System.register(["TinyDecorations", "./View1Controller", "./TestService", "./TestService2", "./AppConstants", "../testAssets/RestService", "../testAssets/RestService2", "../testAssets/CacheService", "../testAssets/RestService3", "../testAssets/RestService4", "Routing"], function (exports_1, context_1) {
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
    var TinyDecorations, NgModule, View1Controller_1, Config, TestService_1, TestService2_1, AppConstants_1, RestService_1, RestService2_1, CacheService_1, RestService3_1, RestService4_1, Routing_1, View1Config, View1Module;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (View1Controller_1_1) {
                View1Controller_1 = View1Controller_1_1;
            },
            function (TestService_1_1) {
                TestService_1 = TestService_1_1;
            },
            function (TestService2_1_1) {
                TestService2_1 = TestService2_1_1;
            },
            function (AppConstants_1_1) {
                AppConstants_1 = AppConstants_1_1;
            },
            function (RestService_1_1) {
                RestService_1 = RestService_1_1;
            },
            function (RestService2_1_1) {
                RestService2_1 = RestService2_1_1;
            },
            function (CacheService_1_1) {
                CacheService_1 = CacheService_1_1;
            },
            function (RestService3_1_1) {
                RestService3_1 = RestService3_1_1;
            },
            function (RestService4_1_1) {
                RestService4_1 = RestService4_1_1;
            },
            function (Routing_1_1) {
                Routing_1 = Routing_1_1;
            }
        ],
        execute: function () {
            NgModule = TinyDecorations.NgModule;
            Config = TinyDecorations.Config;
            View1Config = /** @class */ (function () {
                function View1Config($routeProvider) {
                    this.$routeProvider = $routeProvider;
                    $routeProvider.when("/view1", Routing_1.MetaData.routeData(View1Controller_1.View1Controller));
                }
                View1Config = __decorate([
                    Config({
                        requires: ["$routeProvider"]
                    }),
                    __metadata("design:paramtypes", [Object])
                ], View1Config);
                return View1Config;
            }());
            exports_1("View1Config", View1Config);
            View1Module = /** @class */ (function () {
                function View1Module() {
                    console.debug("init view1 module");
                }
                View1Module = __decorate([
                    NgModule({
                        name: "myApp.view1",
                        imports: ['ngRoute', "ngResource"],
                        declarations: [View1Controller_1.View1Controller, View1Config],
                        providers: [TestService_1.TestService, AppConstants_1.AppConstants, TestService2_1.TestService2, RestService_1.RestService, RestService2_1.RestService2, RestService3_1.RestService3, RestService4_1.RestService4, CacheService_1.CacheService]
                    }),
                    __metadata("design:paramtypes", [])
                ], View1Module);
                return View1Module;
            }());
            exports_1("View1Module", View1Module);
        }
    };
});
//# sourceMappingURL=View1Module.js.map