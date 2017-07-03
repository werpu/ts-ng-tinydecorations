System.register(["TinyDecorations"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations_1, View2Controller;
    return {
        setters: [
            function (TinyDecorations_1_1) {
                TinyDecorations_1 = TinyDecorations_1_1;
            }
        ],
        execute: function () {
            View2Controller = (function () {
                function View2Controller() {
                }
                View2Controller = __decorate([
                    TinyDecorations_1.Controller({
                        name: "View2Ctrl",
                        template: "\n<p>This is the partial for view 2.</p>\n<p>\n  Showing of 'interpolate' filter:\n  {{ 'Current version is v%VERSION%.' | interpolate }}\n</p>\n"
                    })
                ], View2Controller);
                return View2Controller;
            }());
            exports_1("View2Controller", View2Controller);
        }
    };
});
//# sourceMappingURL=View2Controller.js.map