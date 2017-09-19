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

declare module "Routing" {

    /**
     * helper to determine the metadata of a given artifact
     */
    export class MetaData {
        static  template(controller: any, template ?: string | Function): string | Function;

        static  controllerName(controller: any, defaults ?: string): string;

        static  controllerAs(controller: any, defaults ?: string): string;

        static templateUrl(controller: any, defaults ?: string): string;

        static routeData(controller: any, overrides?: {[key: string]: any}): {[key: string]: any};
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

