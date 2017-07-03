"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var Directive = TinyDecorations.Directive;
var VersionDirective = (function () {
    function VersionDirective(version) {
        this.version = version;
    }
    VersionDirective.prototype.link = function (scope, elm, attrs) {
        elm.text(this.version);
    };
    VersionDirective = __decorate([
        Directive({
            selector: "appVersion",
            requires: ["version"],
            restrict: "EA"
        })
    ], VersionDirective);
    return VersionDirective;
}());
exports.VersionDirective = VersionDirective;
