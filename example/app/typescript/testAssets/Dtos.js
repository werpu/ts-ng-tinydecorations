System.register(["../../../lib/typescript/Dto", "../../../lib/typescript/TinyDecorations"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var Dto_1, TinyDecorations_1, Probe2Impl, Probe1Impl, Probe1_1;
    return {
        setters: [
            function (Dto_1_1) {
                Dto_1 = Dto_1_1;
            },
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            Probe2Impl = (function () {
                function Probe2Impl(data) {
                }
                Probe2Impl = __decorate([
                    Dto_1.Dto({}),
                    __metadata("design:paramtypes", [Object])
                ], Probe2Impl);
                return Probe2Impl;
            }());
            exports_1("Probe2Impl", Probe2Impl);
            Probe1Impl = (function () {
                function Probe1Impl(data, mixin /*put your own arguments in here*/) {
                    if (mixin === void 0) { mixin = {}; } /*put your own arguments in here*/
                }
                Probe1Impl = __decorate([
                    Dto_1.Dto({
                        val3: new Dto_1.ArrType(Probe2Impl),
                        val4: new Dto_1.ArrType(Probe2Impl),
                        val5: Probe2Impl
                    }),
                    __metadata("design:paramtypes", [Object, Object])
                ], Probe1Impl);
                return Probe1Impl;
            }());
            exports_1("Probe1Impl", Probe1Impl);
            Probe1_1 = (function () {
                function Probe1_1(data, mixin /*put your own arguments in here*/) {
                    if (mixin === void 0) { mixin = {}; } /*put your own arguments in here*/
                    this.postConstructCalled = false;
                }
                Probe1_1.prototype.PostConstruct = function (data) {
                    if (data && data.val1) {
                        this.postConstructCalled = true;
                    }
                };
                __decorate([
                    TinyDecorations_1.PostConstruct(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], Probe1_1.prototype, "PostConstruct", null);
                Probe1_1 = __decorate([
                    Dto_1.Dto({
                        val3: new Dto_1.ArrType(Probe2Impl),
                        val4: new Dto_1.ArrType(Probe2Impl),
                        val5: Probe2Impl
                    }),
                    __metadata("design:paramtypes", [Object, Object])
                ], Probe1_1);
                return Probe1_1;
            }());
            exports_1("Probe1_1", Probe1_1);
        }
    };
});
//# sourceMappingURL=Dtos.js.map