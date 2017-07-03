System.register(["TinyDecorations", "./View1Module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TinyDecorations, keepExternals, View1Module_1;
    return {
        setters: [
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            },
            function (View1Module_1_1) {
                View1Module_1 = View1Module_1_1;
            }
        ],
        execute: function () {
            keepExternals = TinyDecorations.keepExternals;
            keepExternals(View1Module_1.View1Module);
            describe('myApp.view1 module', function () {
                beforeEach(module('myApp.view1'));
                describe('view1 controller', function () {
                    it('should ....', inject(function ($controller) {
                        //spec body
                        var view1Ctrl = $controller('View1Ctrl');
                        expect(view1Ctrl).toBeDefined();
                    }));
                });
            });
        }
    };
});
//# sourceMappingURL=View1Module_test.js.map