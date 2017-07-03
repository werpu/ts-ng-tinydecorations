import TinyDecorations = require("TinyDecorations");
import Injectable = TinyDecorations.Injectable;
@Injectable({
    name:"TestService"
})
export class TestService {

    sayHello = "hello world";
}