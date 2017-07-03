import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {ICompileProvider, IControllerService, IRootScopeService} from "angular";
import IProvideService = angular.auto.IProvideService;

import {View2Module} from "./View2Module";

keepExternals(View2Module);

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));

  describe('view2 controller', function(){
    it('should ....', inject(function($controller: IControllerService) {
      //spec body
      var view2Ctrl = $controller('View2Ctrl');
      expect(view2Ctrl).toBeDefined();
    }));
  });
});