import TinyDecorations = require("TinyDecorations");
import Controller = TinyDecorations.Controller;
import {TestService} from "./TestService";
import Inject = TinyDecorations.Inject;
import {TestService2} from "./TestService2";

@Controller({
    name: "View1Ctrl",
    template: `<p>This is the partial for view 1. from Testservice: {{ctrl.testService.sayHello}} 
{{ctrl.TestService2.myVar1}}
{{ctrl.TestService2.hello2}}</p>`,
    controllerAs:"ctrl"
})
export class View1Controller {
    constructor(@Inject(TestService) public testService: TestService, @Inject(TestService2)  public TestService2: TestService2) {
    }
}