import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import {IScope} from "angular";
@Directive({
    selector: "appVersion",
    requires: ["version"],
    restrict: "EA"
})
export class VersionDirective {
    constructor(private version: any) {
    }

    private link(scope: IScope, elm: any, attrs: any) {
        elm.text(this.version);
    }
}