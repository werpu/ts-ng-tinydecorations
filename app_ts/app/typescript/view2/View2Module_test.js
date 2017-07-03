System.register(["TinyDecorations", "./View2Module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations, keepExternals, View2Module_1;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (View2Module_1_1) {
                View2Module_1 = View2Module_1_1;
            }
        ],
        execute: function () {
            keepExternals = TinyDecorations.keepExternals;
            keepExternals(View2Module_1.View2Module);
            describe('myApp.view2 module', function () {
                beforeEach(module('myApp.view2'));
                describe('view2 controller', function () {
                    it('should ....', inject(function ($controller) {
                        //spec body
                        var view2Ctrl = $controller('View2Ctrl');
                        expect(view2Ctrl).toBeDefined();
                    }));
                });
            });
        }
    };
});
//# sourceMappingURL=View2Module_test.js.map