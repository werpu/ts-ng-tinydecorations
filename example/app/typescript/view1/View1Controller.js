System.register(["TinyDecorations", "./TestService", "./TestService2"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations, Controller, TestService_1, Inject, TestService2_1, View1Controller;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (TestService_1_1) {
                TestService_1 = TestService_1_1;
            },
            function (TestService2_1_1) {
                TestService2_1 = TestService2_1_1;
            }
        ],
        execute: function () {
            Controller = TinyDecorations.Controller;
            Inject = TinyDecorations.Inject;
            View1Controller = (function () {
                function View1Controller(testService, TestService2) {
                    this.testService = testService;
                    this.TestService2 = TestService2;
                    this.myVar = "myVar";
                }
                View1Controller = __decorate([
                    Controller({
                        name: "View1Ctrl",
                        template: "<p>This is the partial for view 1. from Testservice: {{ctrl.testService.sayHello}} \n{{ctrl.TestService2.myVar1}}\n{{ctrl.TestService2.hello2}} <br />\n\nVersion with dynamic param<app-version my-var=\"ctrl.myVar\"></app-version>\n</p>",
                        controllerAs: "ctrl"
                    }),
                    __param(0, Inject(TestService_1.TestService)),
                    __metadata("design:paramtypes", [TestService_1.TestService, TestService2_1.TestService2])
                ], View1Controller);
                return View1Controller;
            }());
            exports_1("View1Controller", View1Controller);
        }
    };
});
//# sourceMappingURL=View1Controller.js.map