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
    var TinyDecorations_1, Rest, RestService3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            Rest = TinyDecorations_1.extended.Rest;
            RestService3 = /** @class */ (function () {
                function RestService3($resource) {
                    this.$resource = $resource;
                    this.$rootUrl = "rootUrl";
                    this.__decoratorcalled__ = false;
                }
                RestService3.prototype.decoratedRequest = function () {
                };
                __decorate([
                    Rest({
                        url: "/myRequest"
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Object)
                ], RestService3.prototype, "decoratedRequest", null);
                RestService3 = __decorate([
                    TinyDecorations_1.Injectable("RestService3"),
                    __param(0, TinyDecorations_1.Inject("$resource")),
                    __metadata("design:paramtypes", [Object])
                ], RestService3);
                return RestService3;
            }());
            exports_1("RestService3", RestService3);
        }
    };
});
//# sourceMappingURL=RestService3.js.map