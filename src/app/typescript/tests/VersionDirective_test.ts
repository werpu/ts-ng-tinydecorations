import {VersionModule} from "../components/VersionModule";
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
        var element = $compile('<app-version my-var="\'TEST_VER2\'"></app-version>')($rootScope);
        $rootScope.$digest();
        expect(element.text().indexOf("TEST_VER") != -1).toBe(true);
        expect(element.text().indexOf("TEST_VER2") != -1).toBe(true);
      });
    });
  });

  describe('app-version directive3', function() {
    it('should print a custom version3', function() {
      module(function($provide: IProvideService) {
        $provide.constant('version', 'TEST_VER');
      });
      inject(function($compile: any, $rootScope: IRootScopeService) {
        var element = $compile('<app-version3 my-var="\'TEST_VER2\'"></app-version3>')($rootScope);
        $rootScope.$digest();

        expect(element.text().indexOf("TEST_VER2TEST_VER") == 0).toBe(true);
      });
    });
  });

  describe('app-version directive4', function() {
    it('should print a custom version4', function() {
      module(function($provide: IProvideService) {
        $provide.constant('version', 'TEST_VER');
      });
      inject(function($compile: any, $rootScope: IRootScopeService) {
        var element = $compile('<app-version4 my-var="\'TEST_VER2\'"></app-version4>')($rootScope);
        $rootScope.$digest();

        expect(element.text().indexOf("TEST_VER2TEST_VER") == 0).toBe(true);
      });
    });
  });

});
