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
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations_1, InterpolateFilter;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            InterpolateFilter = (function () {
                function InterpolateFilter(version) {
                    this.version = version;
                }
                InterpolateFilter.prototype.filter = function (text) {
                    return String(text).replace(/\%VERSION\%/mg, this.version);
                };
                InterpolateFilter = __decorate([
                    TinyDecorations_1.Filter({
                        name: "interpolate",
                        requires: ["version"]
                    }),
                    __metadata("design:paramtypes", [String])
                ], InterpolateFilter);
                return InterpolateFilter;
            }());
            exports_1("InterpolateFilter", InterpolateFilter);
        }
    };
});
//# sourceMappingURL=InterpolateFilter.js.map