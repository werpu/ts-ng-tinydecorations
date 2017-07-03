"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var NgModule = TinyDecorations.NgModule;
var View2Controller_1 = require("./View2Controller");
var uiRoute = TinyDecorations.HelperFunctions.uiRoute;
var Config = TinyDecorations.Config;
var View2Config = (function () {
    function View2Config($routeProvider) {
        this.$routeProvider = $routeProvider;
        uiRoute($routeProvider, View2Controller_1.View2Controller, '/view2');
    }
    View2Config = __decorate([
        Config({
            requires: ["$routeProvider"]
        })
    ], View2Config);
    return View2Config;
}());
exports.View2Config = View2Config;
var View2Module = (function () {
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
exports.View2Module = View2Module;
