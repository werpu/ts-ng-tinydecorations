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
    var TinyDecorations_1, Rest, Restable, RestService4;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            Rest = TinyDecorations_1.extended.Rest;
            Restable = TinyDecorations_1.extended.Restable;
            RestService4 = /** @class */ (function () {
                function RestService4() {
                    this.__decoratorcalled2__ = false;
                }
                RestService4.prototype.decoratedRequest = function () {
                };
                __decorate([
                    Rest({
                        url: "/myRequest"
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Object)
                ], RestService4.prototype, "decoratedRequest", null);
                RestService4 = __decorate([
                    TinyDecorations_1.Injectable("RestService4"),
                    Restable({
                        decorator: function (data) {
                            this.__decoratorcalled2__ = true;
                            return data.$promise;
                        },
                        $rootUrl: "rootUrl"
                    }),
                    __metadata("design:paramtypes", [])
                ], RestService4);
                return RestService4;
            }());
            exports_1("RestService4", RestService4);
        }
    };
});
//# sourceMappingURL=RestService4.js.map