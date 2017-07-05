System.register(["TinyDecorations", "./View1Controller", "./TestService", "./TestService2", "./AppConstants"], function (exports_1, context_1) {
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
    var TinyDecorations, NgModule, View1Controller_1, uiRoute, Config, TestService_1, TestService2_1, AppConstants_1, View1Config, View1Module;
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
            }
        ],
        execute: function () {
            NgModule = TinyDecorations.NgModule;
            uiRoute = TinyDecorations.uiRoute;
            Config = TinyDecorations.Config;
            View1Config = (function () {
                function View1Config($routeProvider) {
                    this.$routeProvider = $routeProvider;
                    uiRoute($routeProvider, View1Controller_1.View1Controller, '/view1');
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
            View1Module = (function () {
                function View1Module() {
                }
                View1Module = __decorate([
                    NgModule({
                        name: "myApp.view1",
                        imports: ['ngRoute'],
                        declarations: [View1Controller_1.View1Controller, View1Config, TestService_1.TestService, AppConstants_1.AppConstants, TestService2_1.TestService2]
                    })
                ], View1Module);
                return View1Module;
            }());
            exports_1("View1Module", View1Module);
        }
    };
});
//# sourceMappingURL=View1Module.js.map