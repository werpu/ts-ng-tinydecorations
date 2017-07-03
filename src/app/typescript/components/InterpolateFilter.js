"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var Filter = TinyDecorations.Filter;
var InterpolateFilter = (function () {
    function InterpolateFilter(version) {
        this.version = version;
    }
    InterpolateFilter.prototype.filter = function (text) {
        return String(text).replace(/\%VERSION\%/mg, this.version);
    };
    InterpolateFilter = __decorate([
        Filter({
            name: "interpolate",
            requires: ["version"]
        })
    ], InterpolateFilter);
    return InterpolateFilter;
}());
exports.InterpolateFilter = InterpolateFilter;
