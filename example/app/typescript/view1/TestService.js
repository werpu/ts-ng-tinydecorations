System.register(["TinyDecorations"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var TinyDecorations, Injectable, TestService;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            }
        ],
        execute: function () {
            Injectable = TinyDecorations.Injectable;
            TestService = /** @class */ (function () {
                function TestService() {
                    this.sayHello = "hello world";
                }
                TestService = __decorate([
                    Injectable({
                        name: "TestService"
                    })
                ], TestService);
                return TestService;
            }());
            exports_1("TestService", TestService);
        }
    };
});
//# sourceMappingURL=TestService.js.map