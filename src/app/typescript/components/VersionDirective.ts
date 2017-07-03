import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import Inject = TinyDecorations.Inject;
import {IScope} from "angular";
@Directive({
    selector: "appVersion",
    restrict: "EA"
})
export class VersionDirective {
    constructor(@Inject("version") private version: any) {
    }

    private link(scope: IScope, elm: any, attrs: any) {
        elm.text(this.version);
    }
}