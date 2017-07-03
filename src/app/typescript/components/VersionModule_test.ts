import {VersionModule} from "./VersionModule";
import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;

keepExternals(VersionModule);


describe('myApp.version module', function () {
    beforeEach(module('myApp.version'));

    describe('version service', function () {
        it('should return current version', inject(function (version: string) {
            expect(version).toEqual('0.1');
        }));
    });
});
