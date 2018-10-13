/// <reference path="../../../dist/TinyDecorations.d.ts" />
/// <reference path="../../../dist/Cache.d.ts" />
/// <reference path="../../../dist/Routing.d.ts" />
System.register(["./view2/View2Module", "./view1/View1Module", "./components/VersionModule", "angular-resource", "TinyDecorations"], function (exports_1, context_1) {
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
    var View2Module_1, View1Module_1, VersionModule_1, ngResource, TinyDecorations_1, AppConfig, AppRun, MyApp;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (View2Module_1_1) {
                View2Module_1 = View2Module_1_1;
            },
            function (View1Module_1_1) {
                View1Module_1 = View1Module_1_1;
            },
            function (VersionModule_1_1) {
                VersionModule_1 = VersionModule_1_1;
            },
            function (ngResource_1) {
                ngResource = ngResource_1;
            },
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            TinyDecorations_1.keepExternals(ngResource);
            AppConfig = /** @class */ (function () {
                function AppConfig($locationProvider, $routeProvider) {
                    this.$locationProvider = $locationProvider;
                    this.$routeProvider = $routeProvider;
                    $locationProvider.hashPrefix('!');
                    $routeProvider.otherwise({ redirectTo: '/view1' });
                    console.log("config called");
                }
                AppConfig = __decorate([
                    TinyDecorations_1.Config(),
                    __param(0, TinyDecorations_1.Inject("$locationProvider")),
                    __param(1, TinyDecorations_1.Inject("$routeProvider")),
                    __metadata("design:paramtypes", [Object, Object])
                ], AppConfig);
                return AppConfig;
            }());
            exports_1("AppConfig", AppConfig);
            AppRun = /** @class */ (function () {
                function AppRun() {
                    console.log("run called");
                }
                AppRun = __decorate([
                    TinyDecorations_1.Run(),
                    __metadata("design:paramtypes", [])
                ], AppRun);
                return AppRun;
            }());
            exports_1("AppRun", AppRun);
            MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp = __decorate([
                    TinyDecorations_1.NgModule({
                        name: "myApp",
                        imports: ["ngRoute", "ngResource",
                            View2Module_1.View2Module,
                            VersionModule_1.VersionModule, View1Module_1.View1Module],
                        declarations: [AppConfig, AppRun]
                    })
                ], MyApp);
                return MyApp;
            }());
            exports_1("MyApp", MyApp);
            /*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
            TinyDecorations_1.platformBrowserDynamic().bootstrapModule(MyApp);
        }
    };
});
//# sourceMappingURL=app.js.map