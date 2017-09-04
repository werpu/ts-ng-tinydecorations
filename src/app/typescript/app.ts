/// <reference path="../../../dist/TinyDecorations.d.ts" />
/// <reference path="../../../dist/ExtendedDecorations.d.ts" />


// Declare app level module which depends on views, and components
import {View2Module} from "./view2/View2Module";
import {View1Module} from "./view1/View1Module";
import {VersionModule} from "./components/VersionModule";
import {ILocationProvider} from "angular";
import ngResource = require("angular-resource");
import {Config, Inject, keepExternals, NgModule, platformBrowserDynamic, Run} from "TinyDecorations";

keepExternals(ngResource)


@Config()
export class AppConfig {
    constructor(@Inject("$locationProvider") private $locationProvider: ILocationProvider,
                @Inject("$routeProvider") private $routeProvider: any) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/view1'});
        console.log("config called");
    }
}

@Run()
export class AppRun {
    constructor() {
        console.log("run called");
    }
}

@NgModule({
    name: "myApp",
    imports: ["ngRoute","ngResource",
        View2Module,
        VersionModule, View1Module],
    declarations: [AppConfig, AppRun]
})
export class MyApp {
}


/*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
platformBrowserDynamic().bootstrapModule(MyApp);
