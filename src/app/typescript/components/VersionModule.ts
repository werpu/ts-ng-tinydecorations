import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {VersionDirective} from "./VersionDirective";
import {InterpolateFilter} from "./InterpolateFilter";
import {VersionConst} from "./VersionConst";
import {VersionComponent} from "./VersionComponent";
@NgModule({
    name: "myApp.version",
    exports: [VersionDirective, VersionConst,InterpolateFilter, VersionComponent]
})
export class VersionModule {
}

export var myAppVersion = (<any>VersionModule).angularModule;

