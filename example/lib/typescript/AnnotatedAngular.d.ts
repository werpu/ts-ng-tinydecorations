/// <reference path="../../../src/lib/typings/test.d.ts" />
/**
 * A typescript angular decorator lib, which is similar
 * to what Angular 4 delivers
 * but only for Angular 1.x
 *
 * Following annotations are supported
 * @Component
 * @NgModule
 * @Service
 * @Controller
 * @Constant
 * @Filter
 * @Inject
 *
 * and for component following binding types are supported
 * @Input
 * @Both
 * @Func
 * @AString
 */
export interface IStateProvider {
    state: Function;
}
export interface IAssignable {
    requires?: Array<any>;
}
export interface ICompOptions extends IAssignable {
    selector?: string;
    template?: string;
    templateUrl?: string;
    bindings?: {
        [key: string]: string;
    };
    controllerAs?: string;
    transclude?: boolean | {
        [key: string]: string;
    };
}
export interface IDirectiveOptions extends ICompOptions {
    restrict?: string;
    priority?: number;
    replace?: boolean;
}
/**
 * type for the NgModule annotation
 * @param imports an array of imports (can either be a string with a module name or a module class annotated with NgModule
 * @param exports the module exports, must be annotated classes
 * @param name the name of the module
 */
export interface IModuleOptions {
    imports?: Array<any>;
    declarations?: Array<any>;
    name: string;
}
export interface INamedFragment {
    name: string;
}
export interface IServiceOptions extends INamedFragment, IAssignable {
}
export interface IControllerOptions extends INamedFragment, IAssignable {
    controllerAs?: string;
    template?: string;
    templateUrl?: string;
}
export interface IFilterOptions extends INamedFragment, IAssignable {
}
export interface IAnnotatedFilter<T> {
    filter(value: T, ...additionalParams: string[]): T;
}
/**
 * constructor type definition
 * to avoid compiler errors
 */
export interface AngularCtor<T> {
    new (...args: any[]): T;
    $inject?: any;
}
/**
 * NgModule annotation
 * @param options: IModuleOptions
 */
export declare function NgModule(options: IModuleOptions): (constructor: AngularCtor<Object>) => any;
export declare function Injectable(options: IServiceOptions): (constructor: AngularCtor<Object>) => any;
export declare function Controller(options: IControllerOptions): (constructor: AngularCtor<Object>) => any;
export declare function Filter(options: IFilterOptions): (constructor: AngularCtor<Object>) => any;
export interface IAnnotatedFilter<T> {
    filter(value: T, a1?: string, a2?: string, a3?: string, a4?: string, a5?: string, a6?: string, a7?: string, a8?: string, a9?: string): T;
}
/**
 * backport of the Angular4 component decorator
 * @param options
 * @returns {(constructor:T)=>any}
 * @constructor
 */
export declare function Component(options: ICompOptions): (constructor: AngularCtor<any>) => any;
export declare function Directive(options: IDirectiveOptions): (constructor: AngularCtor<any>) => any;
export declare function Config(options: IAssignable): (constructor: AngularCtor<any>) => any;
export declare function Run(options: IAssignable): (constructor: AngularCtor<any>) => any;
export declare function Constant(name?: string): (target: any, propertyName: string) => any;
/**
 * Input property decorator maps to bindings.property = "<"
 * @param optional if set to true an optional param is used instead aka "<?"
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function Input(optional?: boolean): (target: any, propertyName: string) => void;
/**
 * Bidirectional binding aka "="
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function Both(optional?: boolean): (target: any, propertyName: string) => void;
/**
 * Outjection binding aka "="
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function Out(optional?: boolean): (target: any, propertyName: string) => void;
/**
 * Functional binding aka "&"
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function Func(optional?: boolean): (target: any, propertyName: string) => void;
/**
 * string binding aka "&"
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function AString(optional?: boolean): (target: any, propertyName: string) => void;
/**
 * injection (other way to inject than requires)
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export declare function Inject(artifact?: any): any;
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
export declare function route($stateProvider: IStateProvider, controller: any, name: string, url: string, security?: Array<string>, routes?: Array<IRouteView>): IRoutableStateProvider;
export declare function uiRoute($routeProvider: any, controller: any, route: string): void;
export declare function platformBrowserDynamic(): {
    bootstrapModule: (mainModule: any) => void;
};
/**
 * helper for the compiler to keep external modules
 *
 * @param params
 */
export declare function keepExternals(...params: any[]): void;
