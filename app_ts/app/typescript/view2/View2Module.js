System.register(["TinyDecorations", "./View2Controller"], function (exports_1, context_1) {
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
    var TinyDecorations, NgModule, View2Controller_1, uiRoute, Config, View2Config, View2Module;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (View2Controller_1_1) {
                View2Controller_1 = View2Controller_1_1;
            }
        ],
        execute: function () {
            NgModule = TinyDecorations.NgModule;
            uiRoute = TinyDecorations.uiRoute;
            Config = TinyDecorations.Config;
            View2Config = (function () {
                function View2Config($routeProvider) {
                    this.$routeProvider = $routeProvider;
                    uiRoute($routeProvider, View2Controller_1.View2Controller, '/view2');
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
            View2Module = (function () {
                function View2Module() {
                }
                View2Module = __decorate([
                    NgModule({
                        name: "myApp.view2",
                        imports: ['ngRoute'],
                        declarations: [View2Controller_1.View2Controller, View2Config]
                    })
                ], View2Module);
                return View2Module;
            }());
            exports_1("View2Module", View2Module);
        }
    };
});
//# sourceMappingURL=View2Module.js.map