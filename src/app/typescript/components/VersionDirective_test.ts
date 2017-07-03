import {VersionModule} from "./VersionModule";
import * as angular from "angular";
import {IRootScopeService} from "angular";
import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;

import IProvideService = angular.auto.IProvideService;


keepExternals(VersionModule);


describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('app-version directive', function() {
    it('should print current version', function() {
      module(function($provide: IProvideService) {
        $provide.constant('version', 'TEST_VER');
      });
      inject(function($compile: any, $rootScope: IRootScopeService) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});
