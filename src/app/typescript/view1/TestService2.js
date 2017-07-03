"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TinyDecorations = require("TinyDecorations");
var Inject = TinyDecorations.Inject;
var Service = TinyDecorations.Service;
var TestService2 = (function () {
    function TestService2(myVar1, hello2) {
        this.myVar1 = myVar1;
        this.hello2 = hello2;
    }
    TestService2 = __decorate([
        Service({ name: "TestService2" }),
        __param(0, Inject("hello1")), __param(1, Inject())
    ], TestService2);
    return TestService2;
}());
exports.TestService2 = TestService2;
