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
                describe('interpolate filter', function () {
                    beforeEach(module(function ($provide) {
                        $provide.constant('version', 'TEST_VER');
                    }));
                    it('should replace VERSION', inject(function (interpolateFilter) {
                        expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
                    }));
                });
            });
        }
    };
});
//# sourceMappingURL=InterpolateFilter_test.js.map