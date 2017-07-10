System.register(["TinyDecorations", "../view1/TestService2"], function (exports_1, context_1) {
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
    var TinyDecorations_1, Rest, RequestParam, PathVariable, RequestBody, TestService2_1, RestService;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            },
            function (TestService2_1_1) {
                TestService2_1 = TestService2_1_1;
            }
        ],
        execute: function () {
            Rest = TinyDecorations_1.extended.Rest;
            RequestParam = TinyDecorations_1.extended.RequestParam;
            PathVariable = TinyDecorations_1.extended.PathVariable;
            RequestBody = TinyDecorations_1.extended.RequestBody;
            RestService = (function () {
                function RestService(testService2) {
                    this.testService2 = testService2;
                    this.$rootUrl = "rootUrl";
                }
                RestService.prototype.myDoit = function () {
                };
                RestService.prototype.myReqEmpty = function () {
                };
                RestService.prototype.myRequest = function () {
                };
                RestService.prototype.myRequestEmbedded = function () {
                };
                RestService.prototype.standardGetWithUrlParams = function (param1, param2) {
                };
                RestService.prototype.getMixedParams = function (param1, param2, requestParam1, requestParam2, requestBody) {
                    //mixed param with all allowed param types
                };
                RestService.prototype.getMixedParamsPost = function (param1, param2, requestParam1, requestParam2, requestBody) {
                    //mixed param with all allowed param types
                };
                RestService.prototype.getMixedParamsPostArr = function (param1, param2, requestParam1, requestParam2, requestBody) {
                    //mixed param with all allowed param types
                };
                __decorate([
                    Rest({
                        url: "/myRequest",
                        method: TinyDecorations_1.REST_TYPE.GET,
                        decorator: function (inPromise) {
                            this.__decoratorcalled__ = true;
                            return inPromise.$promise;
                        }
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "myReqEmpty", null);
                __decorate([
                    Rest({
                        url: "/myRequest",
                        method: TinyDecorations_1.REST_TYPE.GET
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "myRequest", null);
                __decorate([
                    Rest({
                        url: "/myRequest",
                        method: TinyDecorations_1.REST_TYPE.GET
                    }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "myRequestEmbedded", null);
                __decorate([
                    Rest({
                        url: "/standardGet",
                        method: TinyDecorations_1.REST_TYPE.GET
                    }),
                    __param(0, PathVariable({ name: "param1" })), __param(1, PathVariable({ name: "param2" })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, String]),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "standardGetWithUrlParams", null);
                __decorate([
                    Rest({
                        url: "/mixedGet",
                        method: TinyDecorations_1.REST_TYPE.GET
                    }),
                    __param(0, PathVariable({ name: "param1" })),
                    __param(1, PathVariable({ name: "param2" })),
                    __param(2, RequestParam({ name: "requestParam1" })),
                    __param(3, RequestParam({ name: "requestParam2" })),
                    __param(4, RequestBody({ name: "requestBody" })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, String, String, String, Object]),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "getMixedParams", null);
                __decorate([
                    Rest({
                        url: "/getMixedParamsPost",
                        method: TinyDecorations_1.REST_TYPE.POST
                    }),
                    __param(0, PathVariable({ name: "param1" })),
                    __param(1, PathVariable({ name: "param2" })),
                    __param(2, RequestParam({ name: "requestParam1" })),
                    __param(3, RequestParam({ name: "requestParam2" })),
                    __param(4, RequestBody({ name: "requestBody" })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, String, String, String, Object]),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "getMixedParamsPost", null);
                __decorate([
                    Rest({
                        url: "/getMixedParamsPost",
                        method: TinyDecorations_1.REST_TYPE.POST,
                        isArray: true
                    }),
                    __param(0, PathVariable({ name: "param1" })),
                    __param(1, PathVariable({ name: "param2" })),
                    __param(2, RequestParam({ name: "requestParam1" })),
                    __param(3, RequestParam({ name: "requestParam2" })),
                    __param(4, RequestBody({ name: "requestBody" })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, String, String, String, Object]),
                    __metadata("design:returntype", Object)
                ], RestService.prototype, "getMixedParamsPostArr", null);
                RestService = __decorate([
                    TinyDecorations_1.Injectable({ name: "RestService" }),
                    __param(0, TinyDecorations_1.Inject(TestService2_1.TestService2)),
                    __metadata("design:paramtypes", [TestService2_1.TestService2])
                ], RestService);
                return RestService;
            }());
            exports_1("RestService", RestService);
        }
    };
});
//# sourceMappingURL=RestService.js.map