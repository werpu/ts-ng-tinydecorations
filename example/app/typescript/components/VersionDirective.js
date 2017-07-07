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
    var TinyDecorations, Directive, Inject, TinyDecorations_1, VersionDirective;
    return {
        setters: [
            function (TinyDecorations_2) {
                TinyDecorations = TinyDecorations_2;
                TinyDecorations_1 = TinyDecorations_2;
            }
        ],
        execute: function () {
            Directive = TinyDecorations.Directive;
            Inject = TinyDecorations.Inject;
            VersionDirective = (function () {
                function VersionDirective(version, $scope) {
                    this.version = version;
                    this.$scope = $scope;
                }
                //link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any) {
                //    console.log("link", this.myVar);
                //}
                VersionDirective.prototype.preLink = function (scope, elm, attrs) {
                    console.log("prelink");
                };
                VersionDirective.prototype.postLink = function (scope, elm, attrs) {
                    debugger;
                    //elm.text(this.version);
                };
                __decorate([
                    TinyDecorations_1.Input(),
                    __metadata("design:type", String)
                ], VersionDirective.prototype, "myVar", void 0);
                VersionDirective = __decorate([
                    Directive({
                        selector: "app-version",
                        restrict: "EA",
                        transclude: true,
                        controllerAs: "ctrl",
                        bindToController: true,
                        template: "<div><ng-transclude></ng-transclude>{{ctrl.version}} - {{ctrl.myVar}}</div>"
                    }),
                    __param(0, Inject("version")), __param(1, Inject("$scope")),
                    __metadata("design:paramtypes", [Object, Object])
                ], VersionDirective);
                return VersionDirective;
            }());
            exports_1("VersionDirective", VersionDirective);
        }
    };
});
//# sourceMappingURL=VersionDirective.js.map