import TinyDecorations = require("TinyDecorations");
import NgModule = TinyDecorations.NgModule;
import {View1Controller} from "./View1Controller";

import Config = TinyDecorations.Config;
import {TestService} from "./TestService";
import {TestService2} from "./TestService2";
import {AppConstants} from "./AppConstants";
import {RestService} from "../testAssets/RestService";
import {RestService2} from "../testAssets/RestService2";
import {CacheService} from "../testAssets/CacheService";
import {RestService3} from "../testAssets/RestService3";
import {RestService4} from "../testAssets/RestService4";
import {MetaData} from "Routing";
import {RestService5} from "../testAssets/RestService5";



@Config({
    requires: ["$routeProvider"]
})
export class View1Config {
    constructor(private $routeProvider: any) {
        $routeProvider.when("/view1", MetaData.routeData(View1Controller));
    }
}

@NgModule({
    name: "myApp.view1",
    imports: ['ngRoute',"ngResource"],
    declarations: [View1Controller, View1Config],
    providers: [TestService, AppConstants, TestService2, RestService, RestService2, RestService3, RestService4, RestService5, CacheService]
})
export class View1Module {
    constructor() {
        console.debug("init view1 module");
    }
}