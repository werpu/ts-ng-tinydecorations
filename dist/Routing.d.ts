
declare module "Routing" {

    /**
     * helper to determine the metadata of a given artifact
     */
    export class MetaData {
        static  template(controller: any, template ?: string | Function): string | Function;

        static  controllerName(controller: any, defaults ?: string): string;

        static  controllerAs(controller: any, defaults ?: string): string;

        static templateUrl(controller: any, defaults ?: string): string;
    }

    export interface IStateProvider {
        state: Function;
    }

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

