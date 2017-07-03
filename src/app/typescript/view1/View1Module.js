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
var View1Controller_1 = require("./View1Controller");
var uiRoute = TinyDecorations.HelperFunctions.uiRoute;
var Config = TinyDecorations.Config;
var TestService_1 = require("./TestService");
var TestService2_1 = require("./TestService2");
var AppConstants_1 = require("./AppConstants");
var View1Config = (function () {
    function View1Config($routeProvider) {
        this.$routeProvider = $routeProvider;
        uiRoute($routeProvider, View1Controller_1.View1Controller, '/view1');
    }
    View1Config = __decorate([
        Config({
            requires: ["$routeProvider"]
        })
    ], View1Config);
    return View1Config;
}());
exports.View1Config = View1Config;
var View1Module = (function () {
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
exports.View1Module = View1Module;
