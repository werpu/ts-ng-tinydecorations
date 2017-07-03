

import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {IControllerService} from "angular";
import {View1Module} from "./View1Module";

keepExternals(View1Module);


describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller: IControllerService) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});