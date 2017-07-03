import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {View2Controller} from "./View2Controller";
import uiRoute = TinyDecorations.uiRoute;
import Config = TinyDecorations.Config;
import {Inject} from "../../../../app_ts/lib/typescript/AnnotatedAngular";

@Config({
    providers:["$routeProvider"]
})
export class View2Config {
    constructor(private $routeProvider: any) {
        uiRoute($routeProvider,View2Controller,'/view2');
    }
}

@NgModule({
    name: "myApp.view2",
    imports: ['ngRoute'],
    declarations: [View2Controller, View2Config]
})
export class View2Module {
}