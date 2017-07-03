"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var Component = TinyDecorations.Component;
var VersionComponent = (function () {
    function VersionComponent(version) {
        this.version = version;
    }
    VersionComponent = __decorate([
        Component({
            selector: "app-version-comp",
            requires: ["version"],
            template: "<div>{{ctrl.version}}</div>",
            controllerAs: "ctrl"
        })
    ], VersionComponent);
    return VersionComponent;
}());
exports.VersionComponent = VersionComponent;
