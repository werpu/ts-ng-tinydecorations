import TinyDecorations = require("TinyDecorations");
import Inject = TinyDecorations.Inject;
import {AppConstants} from "./AppConstants";
import Injectable = TinyDecorations.Injectable;
import {TestService} from "./TestService";

@Injectable({name: "TestService2"})
export class TestService2 {
    constructor(@Inject("hello1") public myVar1: string,
                @Inject() public hello2: string,
                @Inject() public TestService: TestService) {
    }
}