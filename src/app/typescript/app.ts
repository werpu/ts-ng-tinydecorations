/// <reference path="../typings/test.d.ts" />
/// <reference path="../../../dist/TinyDecorations.d.ts" />

// Declare app level module which depends on views, and components
import {View2Module} from "./view2/View2Module";
import {View1Module} from "./view1/View1Module";
import {VersionModule} from "./components/VersionModule";
import {ILocationProvider} from "angular";
import {Config, NgModule, platformBrowserDynamic} from "TinyDecorations";



@Config({
    requires: ['$locationProvider', '$routeProvider']
})
export class AppConfig {
    constructor(private $locationProvider: ILocationProvider, private $routeProvider: any) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/view1'});
    }
}

@NgModule({
    name: "myApp",
    imports: ["ngRoute",View1Module,
        View2Module,
        View1Module,
        VersionModule],
    declarations: [AppConfig]
})
class MyApp {
}


/*now lets bootstrap the application, unfortunately ng-app does not work due to the systemjs lazy binding*/
platformBrowserDynamic().bootstrapModule(MyApp);
