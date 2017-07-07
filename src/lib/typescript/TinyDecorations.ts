/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//we need to have an angular import one way or the other
import {IAngularStatic} from "angular";
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

//we cannot reference angular directly we have to rely on it being present
//To avoid dependency clashes


declare var angular: IAngularStatic;

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


export interface IStateProvider {
    state: Function;
}

export interface IAssignable {
    //providers?: Array<any>;
}

export interface ICompOptions extends IAssignable {
    selector?: string;
    template?: string;
    templateUrl?: string;
    bindings?: { [key: string]: string };
    controllerAs?: string;
    transclude ?: boolean | { [key: string]: string };
}

export interface IDirectiveOptions extends ICompOptions {
    restrict ?: string;
    priority ?: number;
    replace ?: boolean;
    require?: Array<any>;
    bindToController ?: boolean;
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

    /*module imports (other modules wich this module uses)*/
    imports?: Array<any>,

    /*
     exports are dependend on their type in case of a simple injectable they are initialized on demand
     in case of components etc...
     the component api is used as is
     */
    exports?: Array<any>,


    providers?: Array<any>,

    /*declaration are per spec of Angular2 Injectables initialized as singletons*/
    declarations?: Array<any>;

    /*The Module name*/
    name: string
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


function register(declarations?: Array<any>, cls?: any, configs: Array<any> = [], runs: Array<any> = []) {


    for (let cnt = 0; declarations && cnt < declarations.length; cnt++) {
        let declaration: any = declarations[cnt];


        if (declaration.__component__) {
            let instance: any = new declaration();
            cls.angularModule = cls.angularModule.component(toCamelCase(<string>instance.__selector__), instance);

        } else if (declaration.__directive__) {
            cls.angularModule = cls.angularModule.directive(toCamelCase(<string>declaration.__name__), function () {
                return instantiate(declaration, []);
            });

        } else if (declaration.__service__) {
            cls.angularModule = cls.angularModule.service((<string>declaration.__name__), declaration.__clazz__);

        } else if (declaration.__controller__) {
            cls.angularModule = cls.angularModule.controller((<string>declaration.__name__), declaration.__clazz__);

        } else if (declaration.__filter__) {
            if (!declaration.prototype.filter) {
                //legacy filter code
                cls.angularModule = cls.angularModule.filter(<string>declaration.__name__, declaration);
            } else {
                //new and improved filter method structure
                cls.angularModule = cls.angularModule.filter(<string>declaration.__name__, declaration.$inject.concat([function () {
                    //if we have a filter function defined we are at our new structure
                    let instance = instantiate(declaration, arguments);
                    return function () {
                        return instance.filter.apply(instance, arguments);
                    }
                }]));
            }

        } else if (declaration.__constant__) {
            cls.angularModule = cls.angularModule.constant((<string>declaration.__name__), declaration.__value__);

        } else if (declaration.__constructorHolder__ || declaration.prototype.__constructorHolder__) {

            //now this looks weird, but typescript resolves this in AMD differently
            //than with any ither loader
            let decl = (declaration.prototype.__constructorHolder__) ? declaration.prototype : declaration;
            for (var key in decl) {
                if (decl[key].__constant__) {
                    cls.angularModule = cls.angularModule.constant((<string>decl[key].__name__), decl[key].__value__);
                }
            }

        } else if (declaration.__config__) {
            configs.push(declaration);

        } else if (declaration.__run__) {
            runs.push(declaration);

        } else {
            throw Error("Declaration type not supported yet");
        }
    }

}

/**
 * NgModule annotation
 * @param options: IModuleOptions
 */
export function NgModule(options: IModuleOptions) {
    return (constructor: AngularCtor<Object>): any => {
        let cls = class GenericModule {
            static angularModule: any;
            static __name__: string;
            __module__ = true;

            constructor() {

                let imports: any = [];

                for (let cnt = 0; options.imports && cnt < options.imports.length; cnt++) {
                    if ("String" == (<any>typeof options.imports[cnt]) || (<any>typeof options.imports[cnt]) instanceof String) {
                        imports.push(options.imports[cnt]);
                    } else if ((<any>options.imports[cnt]).__name__) {
                        imports.push((<any>options.imports[cnt]).__name__)
                    } else {
                        imports.push((<any>options.imports[cnt]));
                    }
                }

                cls.angularModule = angular.module(options.name, imports);
                cls.__name__ = options.name;

                let configs: Array<any> = [];
                let runs: Array<any> = [];


                register(options.declarations, cls, configs, runs);
                register(options.exports, cls, configs, runs);

                for (let cnt = 0; cnt < configs.length; cnt++) {
                    cls.angularModule = cls.angularModule.config(configs[cnt].__bindings__)
                }
                for (let cnt = 0; cnt < runs.length; cnt++) {
                    cls.angularModule = cls.angularModule.run(runs[cnt].__bindings__)
                }
            }
        };

        new cls();
        return cls;
    }
}

/**
 * sideffect free mixing function which mixes two arrays
 *
 * @param source
 * @param target
 * @returns {Array<any>}
 */
function mixin(source: Array<any>, target: Array<any>): Array<any> {
    let retArr: Array<any> = [];
    for (let cnt = 0; cnt < Math.max(source.length, target.length); cnt++) {
        retArr.push((cnt < target.length && C_UDEF != typeof target[cnt]) ? target[cnt] :
            (cnt < source.length && C_UDEF != typeof source[cnt]) ? source[cnt] : null
        );
    }
    return retArr;
}

/**
 * extensive value mapping helper
 *
 * @param target the target key value holder receiving the values
 * @param source a source key value holder
 * @param overwrite if set to true the target will be overwritten even if it exists
 * @param mappingAllowed checks whether the mapping is allowed on the current key
 * @param mapperFunc a mapper function which transforms the values according to the key
 */
function map<T>(source: T, target: T, overwrite: boolean, mappingAllowed ?: (key: string) => boolean, mapperFunc?: (key: string) => any): void {
    for (let key in source) {
        if ((!mappingAllowed ||
            mappingAllowed(<string>key)) &&
            ((C_UDEF != typeof source[key] && overwrite) ||
            (C_UDEF == typeof source[key]))) {
            let val = (mapperFunc) ? mapperFunc(key) : target[key];
            if (C_UDEF != typeof val) {
                target[key] = val;
            }
        }
    }
}

function resolveInjections(constructor: AngularCtor<Object>) {
    let params: Array<any> = getAnnotator()(constructor);
    return mixin(params, resolveRequires((<any>constructor)[C_INJECTIONS]))
}

export function Injectable(options: IServiceOptions) {
    return (constructor: AngularCtor<Object>): any => {
        let cls = class GenericModule extends constructor {
            static __service__ = true;
            static __clazz__ = constructor;
            static __name__ = options.name;
        };

        constructor.$inject = resolveInjections(constructor);

        return cls;
    }
}


export function Controller(options: IControllerOptions) {
    return (constructor: AngularCtor<Object>): any => {
        let cls = class GenericController extends constructor {
            static __controller__ = true;
            static __clazz__ = constructor;
            static __name__ = options.name;
            static __template__ = options.template;
            static __templateUrl__ = options.templateUrl;
            static __controllerAs__ = options.controllerAs || "";
        };
        constructor.$inject = resolveInjections(constructor);

        return cls;
    }
}


export function Filter(options: IFilterOptions) {
    return (constructor: AngularCtor<Object>): any => {
        let cls = class GenericModule extends constructor {
            static __filter__ = true;
            static __clazz__ = constructor;
            static __name__ = options.name;
        };
        constructor.$inject = resolveInjections(constructor);

        return cls;
    }
}

export interface IAnnotatedFilter<T> {
    filter(value: T, ...additionalParams: Array<T>): T;
}


/**
 * backport of the Angular4 component decorator
 * @param options
 * @returns {(constructor:T)=>any}
 * @constructor
 */
export function Component(options: ICompOptions) {
    return (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat([<any>constructor]);

        var tempBindings = constructor.prototype[C_BINDINGS] || {};
        if (options.bindings) {
            for (let key in options.bindings) {
                tempBindings[key] = options.bindings[key];
            }
        }


        let cls = class GenericComponent {
            static __component__ = true;
            __selector__ = options.selector;

            //special cases without auto remapping
            bindings = tempBindings;
            controller = controllerBinding;
        };

        /*we remap the properties*/
        map<ICompOptions>(options, cls.prototype, true, (key: string) => {
            return true
        }, (key: string) => {
            switch (key) {
                case "selector":
                    return undefined;
                case "controllerAs":
                    return options.controllerAs || "";
                case "transclude" :
                    return options.transclude || false;
                default:
                    (<any>options)[key];
            }
        });


        //we transfer the static variables since we cannot derive atm
        map(constructor, cls, true, (key: string) => {
            return key != C_INJECT;
        });

        constructor.prototype.__component__ = cls;
        return cls;
    }
}

export function Directive(options: IDirectiveOptions) {
    return (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat([<any>constructor]);

        var tempBindings = constructor.prototype[C_BINDINGS] || {};
        if (options.bindings) {
            for (let key in options.bindings) {
                tempBindings[key] = options.bindings[key];
            }
        }

        if (options.bindings) {
            for (let key in options.bindings) {
                tempBindings[key] = options.bindings[key];
            }
        }

        let cls = class GenericDirective {
            static __directive__ = true;
            static __bindings__ = controllerBinding;
            static __name__ = options.selector;

            //class extends constructor {
            template: any = function () {
                return options.template || "";
            };
            controller = controllerBinding;
        };



        /*we remap the properties*/
        map<ICompOptions>(options, cls.prototype, true, (key: string) => {
            return true
        }, (key: string) => {
            switch (key) {
                case "selector":
                    return undefined;
                case "controllerAs":
                    return options.controllerAs || "";
                case "transclude" :
                    return options.transclude || false;
                case "restrict":
                    return options.restrict || "E";
                case "priority":
                    return options.priority || 0;
                case "replace":
                    return !!options.replace;
                case  "bindToController":
                    return (C_UDEF == typeof options.bindToController) ? true : options.bindToController;
                case  "multiElement" :
                    return (C_UDEF == typeof options.multiElement) ? false : options.multiElement;
                case  "scope":
                    return (C_UDEF == typeof options.scope) ? ((Object.keys(tempBindings).length) ? tempBindings : undefined) : options.scope;
                case   "link":
                    return (constructor.prototype.link && !constructor.prototype.preLink) ? function (this: any) {
                        constructor.prototype.link.apply(arguments[3], arguments);
                    } : undefined;
                default:
                    (<any>options)[key];
            }
        });


        //prelink postlink handling
        if (constructor.prototype.compile || constructor.prototype.preLink || constructor.prototype.postLink) {
            (<any>cls.prototype)["compile"] = function (this: any) {
                if (constructor.prototype.compile) {
                    return constructor.prototype.compile.prototype.apply(this, arguments)
                } else {

                    var retOpts: { [key: string]: Function } = {};
                    if (constructor.prototype.preLink) {
                        retOpts["pre"] = function () {
                            constructor.prototype.preLink.apply(arguments[3], arguments);
                        }
                    }
                    //link and postlink are the same they more or less exclude each other
                    if (constructor.prototype.postLink && constructor.prototype.link) {
                        throw new Error("You cannot set postlink and link at the same time, they are mutually exclusive" +
                            " and basically the same. Directive: " + options.selector)
                    }
                    if (constructor.prototype.postLink || constructor.prototype.link) {
                        retOpts["post"] = function () {
                            if (constructor.prototype.postLink) {
                                constructor.prototype.postLink.apply(arguments[3], arguments);
                            } else {
                                constructor.prototype.link.apply(arguments[3], arguments);
                            }

                        }
                    }
                    return retOpts;

                }
            };
        }

        //transfer static variables
        map(constructor, cls, true, (key: string) => {
            return key != C_INJECT;
        });

        constructor.prototype.__component__ = cls;
        return cls;
    }
}

export function Config(options?: IAssignable) {
    return (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat(function () {
            instantiate(constructor, arguments);
        });


        let cls = class GenericConfig {
            static __config__ = true;
            static __bindings__ = controllerBinding;
        };
        return cls;
    }
}

export function Run(options?: IAssignable) {
    return (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat(function () {
            instantiate(constructor, arguments);
        });


        let cls = class GenericConfig {
            static __run__ = true;
            static __bindings__ = controllerBinding;
        };
        return cls;
    }
}


export function Constant(name?: string) {
    return function (target: any, propertyName: string): any {
        let cls = class GenericCons {
            static __constant__ = true;
            static __clazz__ = target;
            static __name__ = name || propertyName;

            static __value__ = C_UDEF != typeof target[propertyName] ? target[propertyName] : new target.constructor()[propertyName];
        };
        target[propertyName] = cls;

        target.__constructorHolder__ = true;
    }
}


function getBindings(target: any) {
    if (!target.constructor.prototype[C_BINDINGS]) {
        target.constructor.prototype[C_BINDINGS] = {};
    }
    return target.constructor.prototype.__bindings__;
}


/**
 * Input property decorator maps to bindings.property = "<"
 * @param optional if set to true an optional param is used instead aka "<?"
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function Input(optional = false) {
    return function (target: any, propertyName: string) {
        getBindings(target)[propertyName] = (optional) ? "<?" : "<";
    }
}

/**
 * Bidirectional binding aka "="
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function Both(optional = false) {
    function decorator(target: any, propertyName: string) {
        getBindings(target)[propertyName] = (optional) ? "=?" : "=";
    }

    return decorator;
}

/**
 * Outjection binding aka "="
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function Out(optional = false) {
    function decorator(target: any, propertyName: string) {
        getBindings(target)[propertyName] = (optional) ? "<?" : "<";
    }

    return decorator;
}

/**
 * Functional binding aka "&"
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function Func(optional = false) {
    return function (target: any, propertyName: string) {
        getBindings(target)[propertyName] = (optional) ? "&?" : "&";
    }
}

/**
 * string binding aka "&"
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function AString(optional = false) {
    return function (target: any, propertyName: string) {
        getBindings(target)[propertyName] = (optional) ? "@?" : "@";
    }
}

/**
 * helper function  which determines the injector annotate function
 *
 * @returns {any|((fn:Function, strictDi?:boolean)=>string[])|((inlineAnnotatedFunction:any[])=>string[])}
 */
let getAnnotator = function () {
    return (<any>angular.injector).$$annotate || (<any>angular.injector).annotate;
};
/**
 * injection (other way to inject than requires)
 * @param optional
 * @returns {(target:any, propertyName:string)=>undefined}
 * @constructor
 */
export function Inject(artifact ?: any): any {
    return function (target: any, propertyName: string, pos: number) {
        //we can use an internal function from angular for the parameter parsing
        var paramNames: Array<string> = getAnnotator()(target);
        getInjections(target, paramNames.length)[pos] = (artifact) ? artifact : paramNames[pos];
    }
}

/**
 * generic create if not exist for properties,
 * used all over the system
 *
 *
 * @param target the target which receives the property
 * @param propertyKey the key
 * @param factory a factory function which produces the value of the property
 * @returns {any} whatever the factory returns or is already defined
 */
function getOrCreate(target: { [key: string]: any }, propertyKey: string, factory: () => {}) {
    if (!target[propertyKey]) {
        target[propertyKey] = factory();
    }
    return target[propertyKey];
}

/**
 * fetches the injections array attached to the target
 *
 * @param target
 * @param numberOfParams
 * @returns {any}
 */
function getInjections(target: any, numberOfParams: number): Array<string | Object> {
    return getOrCreate(target, C_INJECTIONS, () => {
        return new Array(numberOfParams);
    });
}

/**
 * fetches the request metadata attached to the taerget
 *
 * @param target
 * @returns {any}
 */
function getRequestMetaData(target: any): { [key: string]: any } {
    return getOrCreate(target, C_REQ_META_DATA, () => {
        return {}
    });
}

function getRequestParams(target: any, numberOfParams: number): Array<string | Object> {
    let metaData: { [key: string]: Array<string> } = getRequestMetaData(target);
    return getOrCreate(metaData, C_REQ_PARAMS, () => {
        return new Array(numberOfParams);
    });
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
        template: controller.__template__ || "",
        controller: controller.__name__,
        controllerAs: controller.__controllerAs__ || ""
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
        template: controller.__template__,
        controller: controller.__name__,
        controllerAs: controller.__controllerAs__ || "ctrl",
        templateUrl: controller.__templateUrl__
    });
}

export function platformBrowserDynamic() {
    return {
        bootstrapModule: function (mainModule: any) {
            let bootstrapModule = (mainModule.__name__) ? mainModule.__name__ : mainModule;
            angular.element(document).ready(function () {
                angular.bootstrap(document, [bootstrapModule]);
            });
        }
    }
}

/**
 * helper for the compiler to keep external modules
 *
 * @param params
 */
export function keepExternals(...params: any[]) {
}


//------------------- helpers ------------------------------------------
function resolveRequires(inArr?: Array<any>): Array<string> {
    var ret: Array<string> = [];
    if (!inArr) {
        return [];
    }
    for (let cnt = 0; cnt < inArr.length; cnt++) {
        if (!inArr[cnt]) {
            continue;
        }
        ret.push(inArr[cnt].__name__ || inArr[cnt]);
    }
    return ret;
}

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

//https://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
function instantiate(ctor: any, args: any) {
    var new_obj = Object.create(ctor.prototype);
    var ctor_ret = ctor.apply(new_obj, args);

    // Some constructors return a value; make sure to use it!
    return ctor_ret !== undefined ? ctor_ret : new_obj;
}


/**
 * Extended helpers which
 * are far off from any angular spec
 *
 * TODO work in progress
 */
export module extended {

    /**
     * Allowed request param types (depending on the param
     * type it ends up in a certain location)
     */
    export type PARAM_TYPE =
        "URL" |
        "REQUEST" |
        "BODY";

    export const PARAM_TYPE = {
        URL: "URL" as PARAM_TYPE,
        REQUEST: "REQUEST" as PARAM_TYPE,
        BODY: "BODY" as PARAM_TYPE
    };


    export interface IRequestParam {
        name?: string;
        paramType?: PARAM_TYPE; //allowed "URL", "REQUEST", "BODY"
    }

    export interface IRestMetaData {
        url: string;      //mandatory URL
        method?: string; //allowed values get, post, put, delete, default is get
        cancellable?: boolean; //defaults to false
        isArray?: boolean; //return value an array?

        //optional response transformator
        transformResponse?: (data: any, headersGetter: any, status: number) => {} | Array<(data: any, headersGetter: any, status: number) => {}>;
        cache?: boolean; //cache used?
        timeout?: number; //request timeout
        responseType?: string; //type of expected response
        hasBody?: boolean; //specifies whether a request body is included
    }

    /**
     * internal metadata
     */
    interface IInternalRequestMetaData extends IRestMetaData {
        __request_params__: Array<IRequestParam>;
    }

    //TODO
    export function RequestParam(paramMetaData ?: IRequestParam): any {
        return function (target: any, propertyName: string, pos: number) {

            //we can use an internal function from angular for the parameter parsing
            var paramNames: Array<string> = getAnnotator()(target[propertyName]);
            getRequestParams(target[propertyName], paramNames.length)[pos] = (paramMetaData) ? paramMetaData : {
                name: paramNames[pos],
                paramType: PARAM_TYPE.URL
            };
        }
    }


    export function Rest(restMetaData ?: IRestMetaData) {
        return function (target: any, propertyName: string, pos: number) {
            let reqMeta: IRestMetaData = <IRestMetaData> getRequestMetaData(target[propertyName]);
            if (restMetaData) {
                map<IRestMetaData>(restMetaData, reqMeta, true);
            }
        }
    }

    export function RestMethod(name?: string) {
        return function (target: any, propertyName: string): any {

            target.__rest_enabled__ = true;

            let cls = class GenericCons {
                static __rest_metadata__ = true;
                static __clazz__ = target;

            };
            target["__rest_meta__" + propertyName] = cls;

            target.__constructorHolder__ = true;
        }
    }
}


