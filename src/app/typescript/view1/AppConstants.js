"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var Constant = TinyDecorations.Constant;
var AppConstants = (function () {
    function AppConstants() {
    }
    AppConstants.hello1 = "Hello world from App Constants";
    AppConstants.hello2 = "Hello world 2 from App Constants";
    __decorate([
        Constant()
    ], AppConstants, "hello1", void 0);
    __decorate([
        Constant()
    ], AppConstants, "hello2", void 0);
    return AppConstants;
}());
exports.AppConstants = AppConstants;
