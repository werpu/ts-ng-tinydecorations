

import {IStateProvider} from "./TinyDecorations";

declare module "Routing" {
    export interface IRouteView {
        name: string;
        controller: any;
        security?: Array<string>;
        url?: any;
    }
    export interface IRoutableStateProvider extends IStateProvider {
        route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, views?: Array<IRouteView>): IRoutableStateProvider;
    }
    /**
     * helper to reduce the ui route code
     * @param $stateProvider
     * @param controller
     * @param name
     * @param url
     * @param security
     */
    export  function route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, routes?: Array<IRouteView>): IRoutableStateProvider;
    export  function uiRoute($routeProvider: any, controller: any, route: string): void;
}

