import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {View2Controller} from "./View2Controller";
import Routing = require("Routing");

import uiRoute = Routing.uiRoute;
import Config = TinyDecorations.Config;
import {RestService} from "../testAssets/RestService";

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
    declarations: [View2Controller, View2Config, RestService]
})
export class View2Module {
}