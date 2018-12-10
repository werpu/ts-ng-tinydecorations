import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import Inject = TinyDecorations.Inject;
import {IAttributes, IScope} from "angular";
import {Input} from "TinyDecorations";
@Directive({
    selector: "app-version4",
    restrict: "EA",
    transclude: true,
    template: "<div><ng-transclude></ng-transclude>{{ctrl.version}} - {{ctrl.myVar}}</div>"
})
export class VersionDirective4 {

    @Input() myVar!: string;

    preLinkCalled: boolean = false;

    constructor(@Inject("version") private version: any,@Inject("$scope") private $scope: any) {

    }

    //link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any) {
    //    console.log("link", this.myVar);
    //}

    preLink(scope: IScope, elm: any, attrs:IAttributes) {
        this.preLinkCalled = true;

        if(!this.$scope) {
            throw Error("injection not found");
        }
    }

    postLink(scope: IScope, elm: JQuery, attrs:IAttributes) {

        if(!this.preLinkCalled) {
            throw Error("prelink not called");
        }
        if(this.myVar) {
            elm.html(this.myVar+this.version);
        }
    }
}