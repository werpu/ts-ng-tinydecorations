System.register(["TinyDecorations", "../view1/View1Module"], function (exports_1, context_1) {
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
            describe('myApp module', function () {
                beforeEach(function () {
                    module('myApp.view1'); //this line fixed it
                });
                describe("Subset Suite", function () {
                    describe('view1 controller', function () {
                        it('it should have a decorated request', inject(function ($httpBackend, RestService3, RestService2) {
                            //spec body
                            expect(RestService3).toBeDefined();
                            expect(RestService3.decoratedRequest).toBeDefined();
                            var res = $httpBackend.expectGET('rootUrl/myRequest')
                                .respond({
                                success: 'response_done'
                            });
                            var executed = false;
                            RestService3.alterRestMeta();
                            RestService3.decoratedRequest().then(function (data) {
                                expect(data.success).toEqual('response_done');
                                executed = true;
                            });
                            $httpBackend.flush();
                            expect(executed).toBe(true);
                            expect(RestService3.__decoratorcalled__).toBe(true);
                        }));
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=RestMetaDataTest.js.map