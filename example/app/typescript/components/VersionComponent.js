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
    var TinyDecorations, Component, TinyDecorations_1, VersionComponent;
    return {
        setters: [
            function (TinyDecorations_2) {
                TinyDecorations = TinyDecorations_2;
                TinyDecorations_1 = TinyDecorations_2;
            }
        ],
        execute: function () {
            Component = TinyDecorations.Component;
            VersionComponent = (function () {
                function VersionComponent(version) {
                    this.version = version;
                }
                __decorate([
                    TinyDecorations_1.Input(),
                    __metadata("design:type", String)
                ], VersionComponent.prototype, "myVar", void 0);
                VersionComponent = __decorate([
                    Component({
                        selector: "app-version-comp",
                        template: "<div>{{ctrl.version}} - {{ctrl.myVar}}</div>",
                        controllerAs: "ctrl"
                    }),
                    __metadata("design:paramtypes", [Object])
                ], VersionComponent);
                return VersionComponent;
            }());
            exports_1("VersionComponent", VersionComponent);
        }
    };
});
//# sourceMappingURL=VersionComponent.js.map