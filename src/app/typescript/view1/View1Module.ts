import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {View1Controller} from "./View1Controller";
import uiRoute = TinyDecorations.uiRoute;
import Config = TinyDecorations.Config;
import {TestService} from "./TestService";
import {TestService2} from "./TestService2";
import {AppConstants} from "./AppConstants";

@Config({
    requires: ["$routeProvider"]
})
export class View1Config {
    constructor(private $routeProvider: any) {
        uiRoute($routeProvider,View1Controller,'/view1');
    }
}

@NgModule({
    name: "myApp.view1",
    imports: ['ngRoute'],
    declarations: [View1Controller, View1Config, TestService, AppConstants, TestService2]
})
export class View1Module {
}