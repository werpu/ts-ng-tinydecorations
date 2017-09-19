import {MetaData, IStateProvider} from "./TinyDecorations";


export interface IRouteView {
    name: string,
    controller: any,
    security?: Array<string>,
    url?: any
}

export interface IRoutableStateProvider extends IStateProvider {
    route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, views ?: Array<IRouteView>): IRoutableStateProvider;
}


/**
 * helper to reduce the ui route code
 * @param $stateProvider
 * @param controller
 * @param name
 * @param url
 * @param security
 */
export function route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, routes?: Array<IRouteView>): IRoutableStateProvider {
    if (!controller.__controller__) {
        throw Error("controller is not an annotated controller");
    }
    var routeData: any = {
        url: url,
        template: MetaData.template(controller),
        controller: MetaData.controllerName(controller),
        controllerAs: MetaData.controllerAs(controller)
    };
    if (security) {
        routeData.security = security;
    }
    if (routes && routes.length) {
        //TODO generate the route json as well
    }
    var retVal: IRoutableStateProvider = <IRoutableStateProvider>$stateProvider.state(
        name, routeData);
    (<any>retVal).route = (controller: any, name: string, url: string, security?: Array<string>): IStateProvider => {
        return route(retVal, controller, name, url, security);
    }
    return retVal;
}


export function uiRoute($routeProvider: any, controller: any, route: string) {
    $routeProvider.when(route, {
        template: MetaData.template(controller),
        controller: MetaData.controllerName(controller),
        controllerAs: MetaData.controllerAs(controller),
        templateUrl: MetaData.templateUrl(controller)
    });
}