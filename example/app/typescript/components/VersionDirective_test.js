System.register(["./VersionModule", "TinyDecorations"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VersionModule_1, TinyDecorations, keepExternals;
    return {
        setters: [
            function (VersionModule_1_1) {
                VersionModule_1 = VersionModule_1_1;
            },
            function (TinyDecorations_1) {
                TinyDecorations = TinyDecorations_1;
            }
        ],
        execute: function () {
            keepExternals = TinyDecorations.keepExternals;
            keepExternals(VersionModule_1.VersionModule);
            describe('myApp.version module', function () {
                beforeEach(module('myApp.version'));
                describe('app-version directive', function () {
                    it('should print current version', function () {
                        module(function ($provide) {
                            $provide.constant('version', 'TEST_VER');
                        });
                        inject(function ($compile, $rootScope) {
                            var element = $compile('<span app-version></span>')($rootScope);
                            expect(element.text()).toEqual('TEST_VER');
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=VersionDirective_test.js.map