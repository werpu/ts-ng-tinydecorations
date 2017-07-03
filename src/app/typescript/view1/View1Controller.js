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
var Controller = TinyDecorations.Controller;
var TestService_1 = require("./TestService");
var Inject = TinyDecorations.Inject;
var TestService2_1 = require("./TestService2");
var View1Controller = (function () {
    function View1Controller(testService, TestService2) {
        this.testService = testService;
        this.TestService2 = TestService2;
    }
    View1Controller = __decorate([
        Controller({
            name: "View1Ctrl",
            template: "<p>This is the partial for view 1. from Testservice: {{ctrl.testService.sayHello}} \n{{ctrl.TestService2.myVar1}}\n{{ctrl.TestService2.hello2}}</p>",
            controllerAs: "ctrl"
        }),
        __param(0, Inject(TestService_1.TestService)), __param(1, Inject(TestService2_1.TestService2))
    ], View1Controller);
    return View1Controller;
}());
exports.View1Controller = View1Controller;
