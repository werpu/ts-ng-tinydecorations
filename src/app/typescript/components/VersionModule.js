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
var VersionDirective_1 = require("./VersionDirective");
var InterpolateFilter_1 = require("./InterpolateFilter");
var VersionConst_1 = require("./VersionConst");
var VersionComponent_1 = require("./VersionComponent");
var VersionModule = (function () {
    function VersionModule() {
    }
    VersionModule = __decorate([
        NgModule({
            name: "myApp.version",
            declarations: [VersionDirective_1.VersionDirective, VersionConst_1.VersionConst, InterpolateFilter_1.InterpolateFilter, VersionComponent_1.VersionComponent]
        })
    ], VersionModule);
    return VersionModule;
}());
exports.VersionModule = VersionModule;
exports.myAppVersion = VersionModule.angularModule;
