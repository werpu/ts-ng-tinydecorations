import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {VersionDirective} from "./VersionDirective";
import {InterpolateFilter} from "./InterpolateFilter";
import {VersionConst} from "./VersionConst";
import {VersionComponent} from "./VersionComponent";
import {VersionDirective2} from "./VersionDirective2";
@NgModule({
    name: "myApp.version",
    exports: [VersionDirective, VersionDirective2, VersionConst,InterpolateFilter, VersionComponent]
})
export class VersionModule {
}

export var myAppVersion = (<any>VersionModule).angularModule;

