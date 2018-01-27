import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {View2Controller} from "./View2Controller";
import Config = TinyDecorations.Config;
import {RestService} from "../testAssets/RestService";
import {MetaData} from "Routing";

@Config({
    providers:["$routeProvider"]
})
export class View2Config {
    constructor(private $routeProvider: any) {
        $routeProvider.when("/view2", MetaData.routeData(View2Controller))
    }
}

@NgModule({
    name: "myApp.view2",
    imports: ['ngRoute'],
    declarations: [View2Controller, View2Config],
    providers: [RestService]
})
export class View2Module {
}