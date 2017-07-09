

import TinyDecorations = require("TinyDecorations");
import keepExternals = TinyDecorations.keepExternals;
import {IControllerService} from "angular";
import {View1Module} from "./View1Module";
import {View1Controller} from "./View1Controller";
import {TestService2} from "./TestService2";

keepExternals(View1Module);

declare var module: any;


describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller: IControllerService, hello2: string, TestService2: TestService2) {
      //spec body
      var view1Ctrl: View1Controller = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
      expect(view1Ctrl.TestService2).toBeDefined();
      expect(view1Ctrl.TestService2.hello2).toEqual(hello2);

    }));

  });
});