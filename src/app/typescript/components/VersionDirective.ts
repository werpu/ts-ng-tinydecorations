import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import Inject = TinyDecorations.Inject;
import {IAttributes, IScope} from "angular";
import {Input} from "TinyDecorations";
@Directive({
    selector: "app-version",
    restrict: "EA",
    transclude: true,
    controllerAs: "ctrl",
    template: "<div><ng-transclude></ng-transclude>{{ctrl.version}} - {{ctrl.myVar}}</div>"
})
export class VersionDirective {

    @Input() myVar: string;

    constructor(@Inject("version") private version: any,@Inject("$scope") private $scope: any) {

    }

    //link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any) {
    //    console.log("link", this.myVar);
    //}

    preLink(scope: IScope, elm: any, attrs:IAttributes) {
        console.log("prelink");
    }

    postLink(scope: IScope, elm: any, attrs:IAttributes) {
        //elm.text(this.version);
    }
}