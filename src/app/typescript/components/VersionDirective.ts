import TinyDecorations = require("TinyDecorations");
import Directive = TinyDecorations.Directive;
import Inject = TinyDecorations.Inject;
import {IScope} from "angular";
@Directive({
    selector: "app-version",
    restrict: "EA",
    transclude: true,
    controllerAs: "ctrl",
    template: "<div><ng-transclude></ng-transclude>{{ctrl.version}}</div>"
})
export class VersionDirective {
    constructor(@Inject("version") private version: any,@Inject("$scope") private $scope: any) {

    }

    link(scope: IScope, elm: any, attrs: any, controller: any, transcludes: any) {

    }
}