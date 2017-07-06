/// <reference path="../../../dist/TinyDecorations.d.ts" />
/// <reference types="angular" />
import { ILocationProvider } from "angular";
export declare class AppConfig {
    private $locationProvider;
    private $routeProvider;
    constructor($locationProvider: ILocationProvider, $routeProvider: any);
}
export declare class AppRun {
    constructor();
}
