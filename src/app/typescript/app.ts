/// <reference path="../../../dist/TinyDecorations.d.ts" />

// Declare app level module which depends on views, and components
import {View2Module} from "./view2/View2Module";
import {View1Module} from "./view1/View1Module";
import {VersionModule} from "./components/VersionModule";
import {ILocationProvider} from "angular";
import {Config, Inject, NgModule, platformBrowserDynamic, Run} from "TinyDecorations";



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
    imports: ["ngRoute",
        View2Module,
        VersionModule, View1Module],
    declarations: [AppConfig, AppRun]
})
class MyApp {
}


/*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
platformBrowserDynamic().bootstrapModule(MyApp);
