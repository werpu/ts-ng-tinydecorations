System.register(["TinyDecorations"], function (exports_1, context_1) {
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
    var TinyDecorations, Inject, Injectable, TestService2;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            }
        ],
        execute: function () {
            Inject = TinyDecorations.Inject;
            Injectable = TinyDecorations.Injectable;
            TestService2 = (function () {
                function TestService2(myVar1, hello2) {
                    this.myVar1 = myVar1;
                    this.hello2 = hello2;
                }
                TestService2 = __decorate([
                    Injectable({ name: "TestService2" }),
                    __param(0, Inject("hello1")), __param(1, Inject()),
                    __metadata("design:paramtypes", [String, String])
                ], TestService2);
                return TestService2;
            }());
            exports_1("TestService2", TestService2);
        }
    };
});
//# sourceMappingURL=TestService2.js.map