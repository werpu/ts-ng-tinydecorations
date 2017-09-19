/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IStateProvider} from "./TinyDecorations";



function toCamelCase(tagName: string) {
    let splittedTagName = tagName.split("-");
    let camelCaseName: Array<String> = [];
    camelCaseName.push(splittedTagName[0]);
    for (let cnt = 1; cnt < splittedTagName.length; cnt++) {
        camelCaseName.push(splittedTagName[cnt].substr(0, 1).toUpperCase());
        camelCaseName.push(splittedTagName[cnt].substr(1, splittedTagName[cnt].length - 1));
    }
    return camelCaseName.join("");
}


export interface IRouteView {
    name: string,
    controller: any,
    security?: Array<string>,
    url?: any
}

export interface IRoutableStateProvider extends IStateProvider {
    route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, views ?: Array<IRouteView>): IRoutableStateProvider;
}



export class MetaData {
    static  template(controller: any, template ?: string | Function): string | Function {
        return controller.__template__ || template || "";
    }

    static  controllerName(controller: any, defaults ?: string): string  {
        return controller.__name__ || toCamelCase(controller.__selector__ || "");
    }

    static  controllerAs(controller: any, defaults = "ctrl"): string  {
        return controller.__controllerAs__ || defaults;
    }

    static templateUrl(controller: any, defaults = null): string {
        return controller.__templateUrl__ || defaults;
    }

    static routeData(controller: any, overrides: {[key: string]: any} = {}): {[key: string]: any} {
        let controllerMap: {[key: string]: any} = {
            template: MetaData.template(controller),
            controller: MetaData.controllerName(controller),
            controllerAs: MetaData.controllerAs(controller),
            templateUrl: MetaData.templateUrl(controller)
        };

        for(let key in overrides) {
            controllerMap[key] = overrides[key];
        }
        return controllerMap;
    }

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