System.register(["TinyDecorations", "./VersionDirective", "./InterpolateFilter", "./VersionConst", "./VersionComponent"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var TinyDecorations, NgModule, VersionDirective_1, InterpolateFilter_1, VersionConst_1, VersionComponent_1, VersionModule, myAppVersion;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (VersionDirective_1_1) {
                VersionDirective_1 = VersionDirective_1_1;
            },
            function (InterpolateFilter_1_1) {
                InterpolateFilter_1 = InterpolateFilter_1_1;
            },
            function (VersionConst_1_1) {
                VersionConst_1 = VersionConst_1_1;
            },
            function (VersionComponent_1_1) {
                VersionComponent_1 = VersionComponent_1_1;
            }
        ],
        execute: function () {
            NgModule = TinyDecorations.NgModule;
            VersionModule = /** @class */ (function () {
                function VersionModule() {
                }
                VersionModule = __decorate([
                    NgModule({
                        name: "myApp.version",
                        exports: [VersionDirective_1.VersionDirective, VersionConst_1.VersionConst, InterpolateFilter_1.InterpolateFilter, VersionComponent_1.VersionComponent]
                    })
                ], VersionModule);
                return VersionModule;
            }());
            exports_1("VersionModule", VersionModule);
            exports_1("myAppVersion", myAppVersion = VersionModule.angularModule);
        }
    };
});
//# sourceMappingURL=VersionModule.js.map