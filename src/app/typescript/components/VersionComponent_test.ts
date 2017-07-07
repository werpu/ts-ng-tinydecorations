import {VersionModule} from "./VersionModule";
import * as angular from "angular";
import {IRootScopeService} from "angular";
import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;

import IProvideService = angular.auto.IProvideService;


keepExternals(VersionModule);

declare var module: any;


describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('app-version directive', function() {
    it('should print current version', function() {
      module(function($provide: IProvideService) {
        $provide.constant('version', 'TEST_VER');
      });
      inject(function($compile: any, $rootScope: IRootScopeService) {
        var element = $compile('<app-version-comp my-var="\'TEST_VER2\'"></app-version-comp>')($rootScope);
        $rootScope.$digest();
        expect(element.text().indexOf("TEST_VER") != -1).toBe(true);
        expect(element.text().indexOf("TEST_VER2") != -1).toBe(true);
      });
    });
  });
});
