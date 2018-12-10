import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {VersionDirective} from "./VersionDirective";
import {InterpolateFilter} from "./InterpolateFilter";
import {VersionConst} from "./VersionConst";
import {VersionComponent} from "./VersionComponent";
import {VersionDirective2} from "./VersionDirective2";
import {VersionDirective3} from "./VersionDirective3";
import {VersionDirective4} from "./VersionDirective4";
@NgModule({
    name: "myApp.version",
    exports: [VersionDirective, VersionDirective2, VersionDirective3,VersionDirective4, VersionConst,InterpolateFilter, VersionComponent]
})
export class VersionModule {
}

export var myAppVersion = (<any>VersionModule).angularModule;

