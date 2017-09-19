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

declare module "TinyDecorations" {


    /**
     * internal constants
     * @type {string}
     */


    export const C_INJECTIONS = "__injections__";
    export const C_REQ_PARAMS = "__request_params__";
    export const C_REQ_META_DATA = "__request_meta__";
    export const C_BINDINGS = "__bindings__";
    export const C_UDEF = "undefined";
    export const C_INJECT = "$inject";
    export const REST_ABORT = "__REST_ABORT__";


    export type PARAM_TYPE = "URL" | "REQUEST" | "BODY";
    export const PARAM_TYPE: {
        URL: PARAM_TYPE;
        REQUEST: PARAM_TYPE;
        BODY: PARAM_TYPE;
    };
    /** Rest types */
    export type REST_TYPE = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    export const REST_TYPE: {
        POST: REST_TYPE;
        GET: REST_TYPE;
        PUT: REST_TYPE;
        PATCH: REST_TYPE;
        DELETE: REST_TYPE;
    };

    export type REST_RESPONSE<T> = angular.IPromise<T> | any;
    /*TODO make it referencing IPromise*/

    export interface IStateProvider {
        state: Function;
    }
    export interface IAssignable {
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
        require?: Array<any>;
        bindToController?: boolean;
        multiElement?: boolean;
        scope?: boolean;
        compile?: Function;
        preLink?: Function;
        postLink?: Function;
    }
    /**
     * type for the NgModule annotation
     * @param imports an array of imports (can either be a string with a module name or a module class annotated with NgModule
     * @param exports the module exports, must be annotated classes
     * @param name the name of the module
     */
    export interface IModuleOptions {
        imports?: Array<any>;
        exports?: Array<any>;
        providers?: Array<any>;
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
    export function NgModule(options: IModuleOptions | string): (constructor: AngularCtor<Object>) => any;

    export function Injectable(options: IServiceOptions | string): (constructor: AngularCtor<Object>) => any;

    export function Controller(options: IControllerOptions | string): (constructor: AngularCtor<Object>) => any;

    export function Filter(options: IFilterOptions | string): (constructor: AngularCtor<Object>) => any;

    export interface IAnnotatedFilter<T> {
        filter(value: T, ...additionalParams: Array<T>): T;
    }
    /**
     * backport of the Angular4 component decorator
     * @param options
     * @returns {(constructor:T)=>any}
     * @constructor
     */
    export function Component(options: ICompOptions | string): (constructor: AngularCtor<any>) => any;

    export function Directive(options: IDirectiveOptions | string): (constructor: AngularCtor<any>) => any;

    export function Config(options?: IAssignable): (constructor: AngularCtor<any>) => any;

    export function Run(options?: IAssignable): (constructor: AngularCtor<any>) => any;

    export function Constant(name?: string): (target: any, propertyName: string) => any;

    /**
     * Input property decorator maps to bindings.property = "<"
     * @param optional if set to true an optional param is used instead aka "<?"
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function Input(optional?: boolean): (target: any, propertyName: string) => void;

    /**
     * Bidirectional binding aka "="
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function Both(optional?: boolean): (target: any, propertyName: string) => void;

    /**
     * Outjection binding aka "="
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function Out(optional?: boolean): (target: any, propertyName: string) => void;

    /**
     * Functional binding aka "&"
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function Func(optional?: boolean): (target: any, propertyName: string) => void;

    /**
     * string binding aka "&"
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function AString(optional?: boolean): (target: any, propertyName: string) => void;

    /**
     * injection (other way to inject than requires)
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    export function Inject(artifact?: any): any;


    export function platformBrowserDynamic(): {
        bootstrapModule: (mainModule: any) => void;
    };

    /**
     * helper for the compiler to keep external modules
     *
     * @param params
     */
    export function keepExternals(...params: any[]): void;

    /**
     * Extended helpers which
     * are far off from any angular spec
     *
     * TODO work in progress
     */
    export module extended {



        /**
         * * various pseudo enums
         * for the rest part
         */
        /**
         * Allowed request param types (depending on the param
         * type it ends up in a certain location)
         */

        interface IRequestParam {
            name?: string;
            defaultValue?: any;
            defaultValueFunc?: Function;
            paramType?: PARAM_TYPE; //allowed "URL", "REQUEST", "BODY"
            optional?: boolean;
            conversionFunc?: (inval: any) => string;
            pos?: number;
        }

        interface IDefaultRestMetaData {
            method?: REST_TYPE; //allowed values get, post, put, patch delete, default is get
            cancellable?: boolean; //defaults to true
            isArray?: boolean; //return value an array?

            //optional response transformator
            transformResponse?: (data: any, headersGetter: any, status: number) => {} | Array<(data: any, headersGetter: any, status: number) => {}>;
            cache?: boolean; //cache used?
            timeout?: number; //request timeout
            responseType?: string; //type of expected response
            hasBody?: boolean; //specifies whether a request body is included
            decorator ?: (retPromise ?: angular.IPromise<any>) => any; //decoration function for the restful function
            $rootUrl ?: string;
        }

        interface IRestMetaData extends IDefaultRestMetaData {
            url: string;
        }

        var DefaultRestMetaData: IDefaultRestMetaData;

        function RequestParam(paramMetaData?: IRequestParam | string): any;

        function PathVariable(paramMetaData?: IRequestParam | string): any;

        function RequestBody(): any;

        function Restable(options?: IDefaultRestMetaData): any;

        function Rest(restMetaData?: IRestMetaData | string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
    }

}
