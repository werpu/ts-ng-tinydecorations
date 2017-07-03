import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import {IScope} from "angular";
import Component = TinyDecorations.Component;
@Component({
    selector: "app-version-comp",
    template:"<div>{{ctrl.version}}</div>",
    controllerAs: "ctrl"
})
export class VersionComponent {
    constructor(public version: any) {

    }
}