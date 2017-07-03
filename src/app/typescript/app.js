"use strict";
/// <reference path="../typings/test.d.ts" />
/// <reference path="../../../dist/TinyDecorations.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Declare app level module which depends on views, and components
var View2Module_1 = require("./view2/View2Module");
var View1Module_1 = require("./view1/View1Module");
var VersionModule_1 = require("./components/VersionModule");
var TinyDecorations = require("TinyDecorations");
var Config = TinyDecorations.Config;
var NgModule = TinyDecorations.NgModule;
var platformBrowserDynamic = TinyDecorations.platformBrowserDynamic;
var AppConfig = (function () {
    function AppConfig($locationProvider, $routeProvider) {
        this.$locationProvider = $locationProvider;
        this.$routeProvider = $routeProvider;
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/view1' });
    }
    AppConfig = __decorate([
        Config({
            requires: ['$locationProvider', '$routeProvider']
        })
    ], AppConfig);
    return AppConfig;
}());
exports.AppConfig = AppConfig;
var MyApp = (function () {
    function MyApp() {
    }
    MyApp = __decorate([
        NgModule({
            name: "myApp",
            imports: ["ngRoute", View1Module_1.View1Module,
                View2Module_1.View2Module,
                View1Module_1.View1Module,
                VersionModule_1.VersionModule],
            declarations: [AppConfig]
        })
    ], MyApp);
    return MyApp;
}());
/*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
platformBrowserDynamic().bootstrapModule(MyApp);
