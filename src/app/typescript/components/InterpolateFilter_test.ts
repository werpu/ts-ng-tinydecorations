
import {VersionModule} from "./VersionModule";
import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import * as angular from "angular";
import IProvideService = angular.auto.IProvideService;

declare var module: any;

keepExternals(VersionModule);

describe('myApp.version module', function() {
    beforeEach(module('myApp.version'));

    describe('interpolate filter', function() {
        beforeEach(module(function($provide:IProvideService) {
            $provide.constant('version', 'TEST_VER');
        }));

        it('should replace VERSION', inject(function(interpolateFilter: any) {
            expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
        }));
    });
});