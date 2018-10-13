System.register(["TinyDecorations", "./View2Controller", "../testAssets/RestService", "Routing"], function (exports_1, context_1) {
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
    var TinyDecorations, NgModule, View2Controller_1, Config, RestService_1, Routing_1, View2Config, View2Module;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (View2Controller_1_1) {
                View2Controller_1 = View2Controller_1_1;
            },
            function (RestService_1_1) {
                RestService_1 = RestService_1_1;
            },
            function (Routing_1_1) {
                Routing_1 = Routing_1_1;
            }
        ],
        execute: function () {
            NgModule = TinyDecorations.NgModule;
            Config = TinyDecorations.Config;
            View2Config = /** @class */ (function () {
                function View2Config($routeProvider) {
                    this.$routeProvider = $routeProvider;
                    $routeProvider.when("/view2", Routing_1.MetaData.routeData(View2Controller_1.View2Controller));
                }
                View2Config = __decorate([
                    Config({
                        providers: ["$routeProvider"]
                    }),
                    __metadata("design:paramtypes", [Object])
                ], View2Config);
                return View2Config;
            }());
            exports_1("View2Config", View2Config);
            View2Module = /** @class */ (function () {
                function View2Module() {
                }
                View2Module = __decorate([
                    NgModule({
                        name: "myApp.view2",
                        imports: ['ngRoute'],
                        declarations: [View2Controller_1.View2Controller, View2Config],
                        providers: [RestService_1.RestService]
                    })
                ], View2Module);
                return View2Module;
            }());
            exports_1("View2Module", View2Module);
        }
    };
});
//# sourceMappingURL=View2Module.js.map