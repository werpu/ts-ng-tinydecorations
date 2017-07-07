import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import {IScope} from "angular";
import Component = TinyDecorations.Component;
import {Inject, Input} from "TinyDecorations";
@Component({
    selector: "app-version-comp",
    template:"<div>{{ctrl.version}} - {{ctrl.myVar}}</div>",
    controllerAs: "ctrl"
})
export class VersionComponent {

    @Input() myVar: string;

    constructor(public version: any) {

    }
}