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


//we need to have an angular import one way or the other
import {IAngularStatic, Injectable, IPromise} from "angular";

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
 * @Directive
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
export const C_PATH_VARIABLES = "__path_variables__";
export const C_REQ_BODY = "__request_body__";
export const C_REQ_META_DATA = "__request_meta__";

const C_BINDINGS = "__bindings__";
const C_RESTFUL = "__restful__";
const C_UDEF = "undefined";
const C_INJECT = "$inject";
export const REST_ABORT = "__REST_ABORT__";
const C_RESOURCE = "$resource";
const C_TYPE_SERVICE = "__service__";
const C_REST_RESOURCE = "__rest_res__";
const C_REST_INIT = "__rest_init__";
const C_SELECTOR = "__selector__";
const C_NAME = "__name__";
const C_VAL = "__value__";
const C_RES_INJ = "__resourceinjected__";

export const POST_INIT = "__post_init__";
export const POST_INIT_EXECUTED = "__post_init__exec__";

let genIdx = 0;

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

/** Rest types */
export type REST_TYPE =
    "POST" |
    "GET" |
    "PUT" |
    "PATCH" |
    "DELETE";


export const REST_TYPE = {
    POST: "POST" as REST_TYPE,
    GET: "GET" as REST_TYPE,
    PUT: "PUT" as REST_TYPE,
    PATCH: "PATCH" as REST_TYPE,
    DELETE: "DELETE" as REST_TYPE
};


export type REST_RESPONSE<T> = IPromise<T> | "__REST_ABORT__";

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
    transclude?: boolean | { [key: string]: string };
}

export interface IDirectiveOptions extends ICompOptions {
    restrict?: string;
    priority?: number;
    replace?: boolean;
    require?: string | Array<any>;
    bindToController?: boolean;
    multiElement?: boolean;
    scope?: boolean | { [key: string]: string };
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
    new(...args: any[]): T;

    $inject?: any;
}


/**
 * External registration manager
 * which allows to plug an external registration
 * into the core system
 *
 * @type {Array}
 */
export class RegistrationManager {
    private registrationHandlers: Array<(declaration?: any /*decorated artifact*/, parentModuleClass?: any /*current module class can be used for meta data registration into the module*/, configs?: Array<any> /*optional config array */, runs?: Array<any>/*optional run array*/) => void | boolean> = [];


    addRegistration(handler: (declaration?: any /*decorated artifact*/, parentModuleClass?: any /*current module class can be used for meta data registration into the module*/, configs?: Array<any> /*optional config array */, runs?: Array<any>/*optional run array*/) => void | boolean) {
        this.registrationHandlers.push(handler);
    }


    execute(alreadyProcessed: { [key: string]: boolean }, declarations?: Array<any> /*decorated artifact*/, parentModuleClass?: any /*current decorated class*/, configs: Array<any> = [] /*optional config array*/, runs: Array<any> = [] /*optional run array*/): { [key: string]: boolean } {

        for (let decCnt = 0; declarations && decCnt < declarations.length; decCnt++) {
            let skipChain = false;

            let processIdx = "" + (declarations[decCnt].__genIdx__ || declarations[decCnt].prototype.__genIdx__);
            if (processIdx !== "undefined" && alreadyProcessed[processIdx]) {
                continue;
            }
            for (let regCnt = 0, len = this.registrationHandlers.length; regCnt < len && !skipChain; regCnt++) {
                skipChain = (this.registrationHandlers[regCnt](declarations[decCnt], parentModuleClass, configs, runs) === false);
            }

            if (!skipChain) {
                throw Error("Declaration type not supported yet");
            }
            alreadyProcessed[processIdx] = true;
        }
        return alreadyProcessed;
    }

}


export var globalRegistrationManager = new RegistrationManager();


//register component
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__component__) {
        let instance: any = new declaration();
        parentModuleClass.angularModule = parentModuleClass.angularModule.component(toCamelCase(<string>instance[C_SELECTOR]), instance);
        return false;
    }
});

//register directive
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__directive__) {
        parentModuleClass.angularModule = parentModuleClass.angularModule.directive(toCamelCase(<string>declaration[C_NAME]), function () {

            return instantiate(declaration, []);

        });
        return false;
    }
});

//register service
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration[C_TYPE_SERVICE]) {
        //subdeclaration of services

        //if it is a rest service it has its own rest generation routine attached
        //That way we can define on how to generate the rest code, via code injection
        //into the library from outside
        //theoretically you can define your own Rest annotation with special behavior that way


        if (declaration[C_RESTFUL]) {
            parentModuleClass.angularModule = parentModuleClass.angularModule.service((<string>declaration[C_NAME]), extended.decorateRestClass(declaration));
        } else {
            parentModuleClass.angularModule = parentModuleClass.angularModule.service((<string>declaration[C_NAME]), declaration);
        }
        return false;
    }
});

//register controller
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__controller__) {
        parentModuleClass.angularModule = parentModuleClass.angularModule.controller((<string>declaration[C_NAME]), declaration);
        return false;
    }
});

//register filter
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__filter__) {
        if (!declaration.prototype.filter) {
            //legacy filter code
            parentModuleClass.angularModule = parentModuleClass.angularModule.filter(<string>declaration[C_NAME], declaration);
        } else {
            //new and improved filter method structure
            parentModuleClass.angularModule = parentModuleClass.angularModule.filter(<string>declaration[C_NAME], declaration.$inject.concat([function () {
                //if we have a filter function defined we are at our new structure
                let instance = instantiate(declaration, arguments);
                return function () {
                    return instance.filter.apply(instance, arguments);
                }
            }]));
        }
        return false
    }
});

//register constant
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__constant__) {
        parentModuleClass.angularModule = parentModuleClass.angularModule.constant((<string>declaration[C_NAME]), declaration[C_VAL]);
        return false;
    }
});

//register constructor
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any) {
    if (declaration.__constructorHolder__ || declaration.prototype.__constructorHolder__) {

        //now this looks weird, but typescript resolves this in AMD differently
        //than with any ither loader
        let decl = (declaration.prototype.__constructorHolder__) ? declaration.prototype : declaration;
        for (var key in decl) {
            if (decl[key].__constant__) {
                parentModuleClass.angularModule = parentModuleClass.angularModule.constant((<string>decl[key][C_NAME]), decl[key][C_VAL]);
            }
        }
        return false;
    }
});

//register config part
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any, configs: Array<any> = []) {
    if (declaration.__config__) {
        configs.push(declaration);
        return false;
    }
});

//register run part
globalRegistrationManager.addRegistration(function (declaration?: any /*decorated artifact*/, parentModuleClass?: any, configs: Array<any> = [], runs: Array<any> = []) {
    if (declaration.__run__) {
        runs.push(declaration);
        return false;
    }
});


function strip<T>(inArr: Array<any>): Array<T> {
    let retArr: Array<T> = [];
    if (C_UDEF == typeof inArr || null == inArr) {
        return inArr;
    }
    for (let cnt = 0, len = inArr.length; cnt < len; cnt++) {
        let element: T = inArr[cnt];
        if (C_UDEF != typeof element) {
            retArr.push(element);
        }
    }
    return retArr;
}

export function PostConstruct() {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        target[POST_INIT] = target[propertyName];
    }
}

export function executePostConstruct(_instance: any, ctor: AngularCtor<any>) {
    if (ctor.prototype[POST_INIT] && !ctor.prototype[POST_INIT_EXECUTED]) {
        ctor.prototype[POST_INIT_EXECUTED] = true;
        ctor.prototype[POST_INIT].apply(_instance, arguments);
    }
}


/**
 * NgModule annotation
 *
 * NgModule is the central registration point
 * where all angular related artifacts are registered
 *
 * @param options: IModuleOptions
 */
export function NgModule(options: IModuleOptions) {
    let retVal = (constructor: AngularCtor<Object>): any => {
        let cls = class GenericModule {
            static angularModule: any;
            static __name__: string;
            __module__ = true;

            constructor() {

                let imports: any = [];

                for (let cnt = 0; options.imports && cnt < options.imports.length; cnt++) {
                    if ("String" == (<any>typeof options.imports[cnt]) || (<any>typeof options.imports[cnt]) instanceof String) {
                        imports.push(options.imports[cnt]);
                    } else if ((<any>options.imports[cnt])[C_NAME]) {
                        imports.push((<any>options.imports[cnt])[C_NAME])
                    } else {
                        imports.push((<any>options.imports[cnt]));
                    }
                }

                cls.angularModule = angular.module(options.name, imports);
                (<any>cls)[C_NAME] = options.name;

                let configs: Array<any> = [];
                let runs: Array<any> = [];

                //for now we treat declarations and exports and providers equally
                //since angular1 does not know any artifact scopes
                //angular2 however treats them differently

                let alreadyProcessed = globalRegistrationManager.execute({}, options.declarations, cls, configs, runs);
                alreadyProcessed = globalRegistrationManager.execute(alreadyProcessed, options.exports, cls, configs, runs);
                globalRegistrationManager.execute(alreadyProcessed, options.providers, cls, configs, runs);

                for (let cnt = 0; cnt < configs.length; cnt++) {
                    cls.angularModule = cls.angularModule.config(configs[cnt][C_BINDINGS])
                }
                for (let cnt = 0; cnt < runs.length; cnt++) {
                    cls.angularModule = cls.angularModule.run(runs[cnt][C_BINDINGS])
                }
                executePostConstruct(this, constructor);
            }
        };

        new cls();
        return cls;
    }
    (<any>retVal).__genIdx__ = genIdx++;
    return retVal;
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
 * @param requiredKeys a set of keys which need to be processed regardless of source having it or not
 * @param source a source key value holder
 * @param target the target key value holder receiving the values
 * @param overwrite if set to true the target will be overwritten even if it exists
 * @param mappingAllowed checks whether the mapping is allowed on the current key
 * @param mapperFunc a mapper function which transforms the values according to the key
 */
function map<T>(requiredKeys: { [key: string]: any }, source: T, target: T, overwrite?: boolean, mappingAllowed ?: (key: string) => boolean, mapperFunc?: (key: string) => any): void {
    let map: { [key: string]: any } = (requiredKeys || {});
    for (let key in source) {
        map[key] = 1;
    }
    for (let key in map) {
        if (!mappingAllowed || mappingAllowed(<string>key)) {
            let mappedVal = (mapperFunc) ? mapperFunc(key) : undefined;
            let cDefMapped = C_UDEF != typeof mappedVal;
            if ((C_UDEF != typeof (<any>source)[key] && overwrite) ||
                (cDefMapped && overwrite) ||
                (C_UDEF != typeof (<any>source)[key] && (C_UDEF == typeof (<any>target)[key] || null == (<any>target)[key])) ||
                (cDefMapped && (C_UDEF == typeof (<any>target)[key] || null == (<any>target)[key]))

            ) {
                let val = (cDefMapped) ? mappedVal : (<any>source)[key];
                if (C_UDEF != typeof val) {
                    (<any>target)[key] = val;
                }
            }
        }
    }
}

function resolveInjections(constructor: AngularCtor<Object>) {
    let params: Array<any> = getAnnotator()(constructor);
    return mixin(params, resolveRequires((<any>constructor)[C_INJECTIONS]))
}


export function Injectable(options: IServiceOptions | string) {
    let retVal = (constructor: AngularCtor<Object>): any => {

        if ("string" == typeof options || options instanceof String) {
            options = <IServiceOptions>{
                name: options
            }
        }

        let cls = class GenericModule extends constructor {
            static __clazz__ = constructor;
            static __name__ = (<IServiceOptions>options).name;
            static __restOptions__ = (<any>constructor).__restOptions__;
            static $inject = resolveInjections(constructor);
            static __genIdx__ = genIdx++;

            constructor() {
                super(...[].slice.call(<any>arguments).slice(0, arguments.length));
                executePostConstruct(this, constructor);
            }
        };

        (<any>cls)[C_TYPE_SERVICE] = true;
        (<any>cls)[C_RESTFUL] = !!(<any>constructor)[C_RESTFUL];
        return cls;
    }

    return retVal;
}


export function Controller(options: IControllerOptions | string) {
    if ("string" == typeof options || options instanceof String) {
        options = <IControllerOptions>{
            name: options
        }
    }
    let retVal = (constructor: AngularCtor<Object>): any => {
        let cls = class GenericController extends constructor {
            static __controller__ = true;
            static __clazz__ = constructor;
            static __name__ = (<IControllerOptions>options).name;
            static __template__ = (<IControllerOptions>options).template;
            static __templateUrl__ = (<IControllerOptions>options).templateUrl;
            static __controllerAs__ = (<IControllerOptions>options).controllerAs || "";
            static __genIdx__ = genIdx++;

            static $inject = resolveInjections(constructor);

            constructor() {
                super(...[].slice.call(<any>arguments).slice(0, arguments.length));
                executePostConstruct(this, constructor);
            }
        };


        return cls;
    }

    return retVal;
}


export function Filter(options: IFilterOptions | string) {
    if ("string" == typeof options || options instanceof String) {
        options = <IFilterOptions>{
            name: options
        }
    }


    let retVal = (constructor: AngularCtor<Object>): any => {
        let cls = class GenericModule extends constructor {
            static __filter__ = true;
            static __clazz__ = constructor;
            static __name__ = (<IFilterOptions>options).name;
            static __genIdx__ = genIdx++;
        };
        constructor.$inject = resolveInjections(constructor);

        return cls;
    }

    return retVal;
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
export function Component(options: ICompOptions | string) {
    if ("string" == typeof options || options instanceof String) {
        options = <ICompOptions>{
            name: options
        }
    }

    let retVal = (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat([<any>constructor]);

        var tempBindings = constructor.prototype[C_BINDINGS] || {};
        if ((<ICompOptions>options).bindings) {
            for (let key in (<any>options).bindings) {
                tempBindings[key] = (<any>options).bindings[key];
            }
        }


        let cls = class GenericComponent {
            static __component__ = true;
            __selector__ = (<ICompOptions>options).selector;

            //special cases without auto remapping
            bindings = tempBindings;
            controller = controllerBinding;
        };

        /*we remap the properties*/
        map<ICompOptions>({
            selector: 1,
            controllerAs: 1,
            transclude: 1
        }, <ICompOptions>options, cls.prototype, true, (key: string) => {
            return true
        }, (key: string) => {
            switch (key) {
                case "selector":
                    return undefined;
                case "controllerAs":
                    return (<any>options).controllerAs || "";
                case "transclude" :
                    return (<any>options).transclude || false;
                default:
                    return (<any>options)[key];
            }
        });


        //we transfer the static variables since we cannot derive atm
        map({}, constructor, cls, true, (key: string) => {
            return key != C_INJECT;
        });

        constructor.prototype.__component__ = cls;
        (<any>cls).__genIdx__ = genIdx++;
        return cls;
    }

    return retVal;
}

export function Directive(options: IDirectiveOptions | string) {
    if ("string" == typeof options || options instanceof String) {
        options = <ICompOptions>{
            name: options
        }
    }

    let retVal = (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat([<any>constructor]);

        var tempBindings = constructor.prototype[C_BINDINGS] || {};
        if ((<IDirectiveOptions>options).bindings) {
            for (let key in (<any>options).bindings) {
                tempBindings[key] = (<any>options).bindings[key];
            }
        }

        if ((<any>options).bindings) {
            for (let key in (<any>options).bindings) {
                tempBindings[key] = (<any>options).bindings[key];
            }
        }

        let cls = class GenericDirective {
            static __directive__ = true;
            static __bindings__ = tempBindings;
            static __name__ = (<IDirectiveOptions>options).selector;



        };


        /*we remap the properties*/
        map<ICompOptions>({
                selector: 1,
                controllerAs: 0,
                transclude: 0,
                restrict: 1,
                priority: 0,
                replace: 0,
                bindToController: 0,
                multiElement: 0,
                link: 0,
                preLink: 0,
                postLink: 0,
                scope: 1,
                controller: 0
            }
            , <ICompOptions>options,
            cls.prototype, true,
            (key: string) => {
                return true
            }, (key: string) => {
                switch (key) {
                    case "selector":
                        return undefined;
                    case "controllerAs":
                        return (<IDirectiveOptions>options).controllerAs || undefined;
                    case "transclude" :
                        return (<IDirectiveOptions>options).transclude || undefined;
                    case "restrict":
                        return (<IDirectiveOptions>options).restrict || "E";
                    case "priority":
                        return (<IDirectiveOptions>options).priority || undefined;
                    case "replace":
                        return (C_UDEF == typeof (<IDirectiveOptions>options).replace) ? undefined : !!(<IDirectiveOptions>options).replace;
                    case  "bindToController":
                        return (C_UDEF == typeof (<IDirectiveOptions>options).bindToController) ? true : (<IDirectiveOptions>options).bindToController;
                    case  "multiElement" :
                        return (C_UDEF == typeof (<IDirectiveOptions>options).multiElement) ? undefined : (<IDirectiveOptions>options).multiElement;

                    case "scope":
                        return (C_UDEF == typeof (<IDirectiveOptions>options).scope) ? ((Object.keys(tempBindings).length) ? tempBindings : undefined) : (<IDirectiveOptions>options).scope;

                    case "controller":
                        return controllerBinding;

                    case   "link":
                        return (constructor.prototype.link && !constructor.prototype.preLink) ? function () {
                            constructor.prototype.link.apply(arguments[3], arguments);
                        } : undefined;
                    default:
                        return (<any>options)[key];
                }
            });


        //prelink postlink handling
        if (constructor.prototype.compile || constructor.prototype.preLink || constructor.prototype.postLink) {
            (<any>cls.prototype)["compile"] = function (this: any) {

                let ret: any = {};
                if (constructor.prototype.compile) {
                    constructor.prototype.compile.prototype.apply(this, arguments)
                }


                var retOpts: { [key: string]: Function } = {};
                if (constructor.prototype.preLink) {
                    retOpts["pre"] = function () {
                        constructor.prototype.preLink.apply(arguments[3], arguments);
                    }
                }
                //link and postlink are the same they more or less exclude each other
                if (constructor.prototype.postLink && constructor.prototype.link) {
                    throw new Error("You cannot set postlink and link at the same time, they are mutually exclusive" +
                        " and basically the same. Directive: " + (<IDirectiveOptions>options).selector)
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


            };
        }

        //transfer static variables
        map({}, constructor, cls, true, (key: string) => {
            return key != C_INJECT;
        });

        constructor.prototype.__directive__ = cls;
        (<any>cls).__genIdx__ = genIdx++;
        return cls;
    }

    return retVal;
}

export function Config(options?: IAssignable) {
    let retVal = (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat(function () {
            instantiate(constructor, arguments);
        });


        let cls = class GenericConfig {
            static __config__ = true;
            static __bindings__ = controllerBinding;
            static __genIdx__ = genIdx++;
        };
        return cls;
    }

    return retVal;
}

export function Run(options?: IAssignable) {
    let retVal = (constructor: AngularCtor<any>): any => {
        let controllerBinding: any = [];
        controllerBinding = resolveInjections(constructor).concat(function () {
            instantiate(constructor, arguments);
        });


        let cls = class GenericConfig {
            static __run__ = true;
            static __bindings__ = controllerBinding;
            static __genIdx__ = genIdx++;
        };
        return cls;
    }
    (<any>retVal).__genIdx__ = genIdx++;
    return retVal;
}


export function Constant(name?: string) {
    return function (target: any, propertyName: string): any {
        let cls = class GenericCons {
            static __constant__ = true;
            static __clazz__ = target;
            static __name__ = name || propertyName;
            static __genIdx__ = genIdx++;

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
    return target.constructor.prototype[C_BINDINGS];
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
function getRequestMetaData(target: any, createIfNotExists = true): { [key: string]: any } {
    return (createIfNotExists) ? getOrCreate(target, C_REQ_META_DATA, () => {
        return {};
    }) : getOrCreate(target, C_REQ_META_DATA, (): any => {
    });
}

function getRequestParams(target: any, numberOfParams: number): Array<string | Object> {
    let metaData: { [key: string]: Array<string> } = getRequestMetaData(target);
    return getOrCreate(metaData, C_REQ_PARAMS, () => {
        return new Array(numberOfParams);
    });
}

function getPathVariables(target: any, numberOfParams: number): Array<string | Object> {
    let metaData: { [key: string]: Array<string> } = getRequestMetaData(target);
    return getOrCreate(metaData, C_PATH_VARIABLES, () => {
        return new Array(numberOfParams);
    });
}

function getRequestBody(target: any): any {
    let metaData: { [key: string]: Array<string> } = getRequestMetaData(target);
    if (metaData[C_REQ_BODY]) {
        throw Error("Only one @RequestBody per method allowed");
    }
    return (<any>metaData)[C_REQ_BODY] = {};
}


export function platformBrowserDynamic() {
    return {
        bootstrapModule: function (mainModule: any) {
            let bootstrapModule = (mainModule[C_NAME]) ? mainModule[C_NAME] : mainModule;
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
        ret.push(inArr[cnt][C_NAME] || inArr[cnt]);
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
    //if(ctor.__bindings__ && !ctor.prototype.scope) {
    //    ctor.prototype.scope = ctor.__bindings__;
    //}

    var new_obj = Object.create(ctor.prototype);
    var ctor_ret = ctor.apply(new_obj, args);

    executePostConstruct(ctor_ret, ctor);

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

    let $resource: any = null;

    /**
     * * various pseudo enums
     * for the rest part
     */


    export interface IRequestParam {
        name: string;
        defaultValue?: any;
        defaultValueFunc?: Function;
        paramType?: PARAM_TYPE; //allowed "URL", "REQUEST", "BODY"
        optional?: boolean;
        conversionFunc?: (inval: any) => string;
        pos?: number;
    }


    export interface IDefaultRestMetaData {
        method?: REST_TYPE; //allowed values get, post, put, patch delete, default is get
        cancellable?: boolean; //defaults to true
        isArray?: boolean; //return value an array?

        //optional response transformator
        transformResponse?: (data: any, headersGetter: any, status: number) => {} | Array<(data: any, headersGetter: any, status: number, metaData?: IDefaultRestMetaData) => {}>;
        cache?: boolean; //cache used?
        timeout?: number; //request timeout
        responseType?: string; //type of expected response
        hasBody?: boolean; //specifies whether a request body is included
        decorator?: (retPromise ?: angular.IPromise<any>, metaData?: IDefaultRestMetaData) => any; //decoration function for the restful function
        /**
         * the root url
         * see the documentation for this one
         */
        $rootUrl?: string;
        /**
         * a request mapper which allows to remap a request url into someting different
         * (a classical example is to prefix request strings with the
         * context path)
         */
        requestUrlMapper?: (requestUrl: string) => string;

        /**
         * additional user metadata used
         * by various callbacks
         */
        userMeta?: any;
    }

    export interface IRestMetaData extends IDefaultRestMetaData {
        url: string;      //mandatory URL
    }


    /**
     * config which can be overridden by the application
     *
     * @type {{url: string; method: (REST_TYPE | any); cancellable: boolean; cache: boolean}}
     */
    export var DefaultRestMetaData: IDefaultRestMetaData = {
        method: REST_TYPE.GET,
        cancellable: true,
        cache: false
    }


    /**
     * internal metadata
     */
    interface IInternalRequestMetaData extends IRestMetaData {
        __request_params__: Array<IRequestParam>;
    }

    //helper to init the param meta data with the appropriate names
    let initParamMetaData = function (paramMetaData: extended.IRequestParam | string, paramNames: Array<string>, pos: number) {
        if (!paramMetaData) {
            paramMetaData = <IRequestParam>{
                name: paramNames[pos]
            }
        } else if (typeof paramMetaData === 'string' || paramMetaData instanceof String) {
            paramMetaData = <IRequestParam>{
                name: paramMetaData
            }
        } else if (!paramMetaData.name) {
            paramMetaData.name = paramNames[pos];
        }

        if (paramMetaData) paramMetaData.pos = pos;
        return paramMetaData;
    };

    export function RequestParam(paramMetaData ?: IRequestParam | string): any {
        return function (target: any, propertyName: string, pos: number) {

            //we can use an internal function from angular for the parameter parsing
            var paramNames: Array<string> = getAnnotator()(target[propertyName]);
            let finalParamMetaData = initParamMetaData(<any>paramMetaData, paramNames, pos);

            getRequestParams(target[propertyName], paramNames.length)[pos] = (finalParamMetaData) ? finalParamMetaData : {
                name: paramNames[pos],
                paramType: PARAM_TYPE.URL,
                pos: pos
            };
        }
    }

    export function PathVariable(paramMetaData ?: IRequestParam | string): any {
        return function (target: any, propertyName: string, pos: number) {

            //we can use an internal function from angular for the parameter parsing
            var paramNames: Array<string> = getAnnotator()(target[propertyName]);

            let finalParamMetaData = initParamMetaData(<any>paramMetaData, paramNames, pos);
            getPathVariables(target[propertyName], paramNames.length)[pos] = (finalParamMetaData) ? finalParamMetaData : {
                name: paramNames[pos],
                paramType: PARAM_TYPE.URL,
                pos: pos
            };
        }
    }

    export function RequestBody(): any {
        return function (target: any, propertyName: string, pos: number) {

            //we can use an internal function from angular for the parameter parsing
            var paramNames: Array<string> = getAnnotator()(target[propertyName]);
            getRequestBody(target[propertyName]);

            getRequestMetaData(target[propertyName])[C_REQ_BODY] = {
                paramType: PARAM_TYPE.BODY,
                pos: pos
            }
        }
    }

    /**
     * Restable annotation
     * allows to class system wide rest annotations
     * @param {extended.IDefaultRestMetaData} options
     * @returns {(constructor: AngularCtor<Object>) => any}
     * @constructor
     */
    export function Restable(options?: IDefaultRestMetaData) {
        return (constructor: AngularCtor<Object>): any => {

            if (!options) {
                return constructor;
            }


            let cls = class GenericModule extends constructor {
                static __restOptions__ = options || {};

                constructor() {
                    super(...[].slice.call(<any>arguments).slice(0, arguments.length));
                }
            };

            (<any>cls)[C_RESTFUL] = true;

            return cls;
        }
    }


    export function Rest(restMetaData ?: IRestMetaData | string) {
        return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {

            let reqMeta: IRestMetaData = <IRestMetaData>getRequestMetaData(target[propertyName]);
            //the entire meta data is attached to the function/method target.propertyName
            if (typeof restMetaData === 'string' || restMetaData instanceof String) {
                restMetaData = <IRestMetaData>{
                    url: restMetaData
                }
            }


            if (restMetaData) {
                //we map the defaults in if they are not set

                //map<IDefaultRestMetaData>( {}, DefaultRestMetaData, restMetaData, false);

                map<IRestMetaData>({}, restMetaData, reqMeta, true);
            }

            if (!target.constructor[C_RESTFUL]) {
                target.constructor[C_RESTFUL] = true;
            }

        }
    }

    let prepareRestMetaData = function (restMetaData: extended.IRestMetaData | string) {
        let finalRestMetaData: IRestMetaData;

        if (typeof restMetaData === 'string' || restMetaData instanceof String) {
            let urlStr: string = (<string>restMetaData);
            finalRestMetaData = {url: urlStr};
        } else {
            finalRestMetaData = <IRestMetaData>restMetaData;
        }
        return finalRestMetaData;
    };

    /**
     * extended simplifier issues a GET statement
     * @param restMetaData the usual metadata without a method type
     */
    export function Get(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.GET;
        return Rest(finalRestMetaData);
    }


    export function Post(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.POST;
        return Rest(finalRestMetaData);
    }

    /**
     * extended simplifier issues a POST statement and gets an array back
     * @param restMetaData the usual metadata without a method type
     */
    export function PostForList(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.POST;
        finalRestMetaData.isArray = true;
        return Rest(finalRestMetaData);
    }

    /**
     * extended simplifier issues a Get statement and gets an array back
     * @param restMetaData the usual metadata without a method type
     */
    export function GetForList(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.GET;
        finalRestMetaData.isArray = true;
        return Rest(finalRestMetaData);
    }

    /**
     * extended simplifier issues a PUT statement
     * @param restMetaData the usual metadata without a method type
     */
    export function Put(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.PUT;
        return Rest(finalRestMetaData);
    }

    /**
     * extended simplifier issues a DELETE statement
     * @param restMetaData the usual metadata without a method type
     */
    export function Delete(restMetaData: IRestMetaData | string) {
        let finalRestMetaData = prepareRestMetaData(restMetaData);
        finalRestMetaData.method = REST_TYPE.DELETE;
        return Rest(finalRestMetaData);
    }

    export function decorateRestClass(clazz: AngularCtor<any>): AngularCtor<any> {
        let fullService = class GenericRestService extends clazz {
            constructor() {


                //We have a $resource as first argument, which is auto added
                super(...[].slice.call(<any>arguments).slice(1, arguments.length));


                this.__restOptions__ = (<any>clazz).__restOptions__;
                //the super constructor did not have assigned a resource
                //we use our own

                if (!this.$resource) {
                    this.$resource = arguments[0];
                }


                //init the rest init methods
                for (var key in clazz.prototype) {
                    let restMeta: IRestMetaData = <IRestMetaData>getRequestMetaData(clazz.prototype[key], false);


                    //no rest annotation we simply dont do anything
                    if (!restMeta) {
                        continue;
                    }

                    this[C_REST_INIT + key]();
                }

                executePostConstruct(this, clazz);
            }
        };

        for (var key in clazz.prototype) {
            let restMeta: IRestMetaData = <IRestMetaData>getRequestMetaData(clazz.prototype[key], false);
            //no rest annotation we simply dont do anything
            if (!restMeta) {
                continue;
            }

            decorateRestFunction(fullService, key, clazz, restMeta);
        }

        //if (!(<any>fullService).$inject || (<any>fullService).$inject.indexOf("$resource") == -1) {
        //we always auto inject a resource
        fullService.$inject = [C_RESOURCE].concat((<any>fullService).$inject || []);
        //}

        return fullService;
    }

    /**
     * helper to decorate the rest functions with our generic calling code
     * of the resources
     *
     * @param target
     * @param key
     * @param clazz
     * @param restMeta
     */
    function decorateRestFunction(target: Function, key: string, clazz: AngularCtor<any>, restMeta: IRestMetaData) {
        //rest annotation found
        //First super call
        //and if the call does not return a REST_ABORT return value
        //we proceed by dynamically building up our rest resource call

        target.prototype[key] = function () {
            if (clazz.prototype[key].apply(this, arguments) === REST_ABORT) {
                return;
            } else {
                let paramsMap: { [key: string]: any } = {};

                let pathVars = strip<IRequestParam>((<any>restMeta)[C_PATH_VARIABLES]);
                let valueCnt = 0;
                for (let cnt = 0; pathVars && cnt < pathVars.length; cnt++) {
                    var param = pathVars[cnt];

                    var value = (cnt < arguments.length && C_UDEF != typeof arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                        ((C_UDEF != typeof param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined
                        );
                    let val_udef: boolean = C_UDEF == typeof value;
                    if (!val_udef) {
                        paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc.call(this, value) : value;
                    } else if (val_udef && param.optional) {
                        continue;
                    } else {
                        throw new Error("Required parameter has no value: method " + key);
                    }
                    valueCnt++;
                }

                let reqParams = strip<IRequestParam>((<any>restMeta)[C_REQ_PARAMS]);

                for (let cnt = 0; reqParams && cnt < reqParams.length; cnt++) {

                    var param: IRequestParam = reqParams[cnt];

                    var value = (cnt < arguments.length && C_UDEF != typeof arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                        ((C_UDEF != typeof param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined
                        );
                    let val_udef: boolean = C_UDEF == typeof value;
                    if (!val_udef) {
                        paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc.call(this, value) : value;
                    } else if (val_udef && param.optional) {
                        continue;
                    } else {
                        throw new Error("Required parameter has no value: method " + key);
                    }
                    valueCnt++;
                }

                let body = ((<any>restMeta)[C_REQ_BODY]) ? arguments[(<any>restMeta)[C_REQ_BODY].pos || 0] : undefined;
                if (C_UDEF != typeof body) {
                    body = (<any>restMeta)[C_REQ_BODY].conversionFunc ? (<any>restMeta)[C_REQ_BODY].conversionFunc.call(this, body) : body;
                }

                //TODO we need also to return a fixed promise
                //data in -> data out for the decorator call

                let retPromise =
                    (C_UDEF != typeof body) ?
                        (restMeta.decorator) ? restMeta.decorator.call(this, (<any>this)[C_REST_RESOURCE + key][restMeta.method || REST_TYPE.GET](paramsMap, body), restMeta) : (<any>this)[C_REST_RESOURCE + key][restMeta.method || REST_TYPE.GET](paramsMap, body).$promise :
                        (restMeta.decorator) ? restMeta.decorator.call(this, (<any>this)[C_REST_RESOURCE + key][restMeta.method || REST_TYPE.GET](paramsMap, {}), restMeta) : (<any>this)[C_REST_RESOURCE + key][restMeta.method || REST_TYPE.GET](paramsMap, {}).$promise
                ;

                //list but not least we transform/decorate the promise from outside if requested
                return retPromise;
            }
        };

        /*
         * every rest resource must be registered on service
         * construction time.
         * Hence we have to define a rest init
         * which then later is called by the constructor.
         */
        target.prototype[C_REST_INIT + key] = function () {

            if (!(this.$resource)) {
                throw Error("rest injectible must have a $resource instance variable");
            }

            let mappedParams: { [key: string]: string } = {};
            let paramDefaults: { [key: string]: string } = {};

            let pathVars = strip<any>((<any>restMeta)[C_PATH_VARIABLES]);
            let pathVariables = [];

            for (let cnt = 0; pathVars && cnt < pathVars.length; cnt++) {
                pathVariables.push(":" + pathVars[cnt].name);
                mappedParams[pathVars[cnt].name] = "@" + pathVars[cnt].name;
                if (C_UDEF != typeof pathVars[cnt].defaultValue) {
                    paramDefaults[pathVars[cnt].name] = pathVars[cnt].defaultValue;
                }
            }

            let reqParams = strip<any>((<any>restMeta)[C_REQ_PARAMS]);

            for (let cnt = 0; reqParams && cnt < reqParams.length; cnt++) {
                var param: IRequestParam = reqParams[cnt];
                mappedParams[param.name] = "@" + param.name;
                if (C_UDEF != typeof param.defaultValue) {
                    paramDefaults[param.name] = param.defaultValue;
                }

            }

            //defaults first the local one from the outer service
            map({}, (<any>this).__restOptions__ || {}, restMeta, false);

            //and if that one does not exist the one from the default settings
            map({}, DefaultRestMetaData, restMeta, false);


            let url = (this.$rootUrl || restMeta.$rootUrl || "") + restMeta.url + ((pathVariables.length) ? "/" + pathVariables.join("/") : "");
            let restActions: any = {};
            let method = restMeta.method || "GET";
            restActions[method] = {};

            var _t = this;
            //we apply all defaults, first the service default then the global default

            map(
                {
                    method: 1,
                    cache: 1,
                    isArray: 1,
                    cancellable: 1,
                    requestBody: 1
                }, /*reqired mappings always returning a value*/
                restMeta, /*source*/
                restActions[method], /*target*/
                false, /*overwrite*/
                (key: string) => {
                    return (key != "url") && (key != "decorator");
                }, //mapping allowed?
                (key: string) => {   //mapping func
                    switch (key) {
                        case "method":
                            return method;
                        case "cache":
                            return !!restMeta.cache;
                        case "isArray":
                            return !!restMeta.isArray;
                        case "cancellable":
                            return C_UDEF == typeof restMeta.cancellable ? true : restMeta.cancellable;
                        case "transformResponse":
                            return (<any>restMeta).transformResponse ? (...args: Array<any>): any => {
                                return (<any>restMeta).transformResponse.apply(_t, args.concat([restMeta]));
                            } : undefined;
                        case "requestBody":
                            return !!(<any>restMeta)[C_REQ_BODY];
                        default:
                            return (<any>restMeta)[key];
                    }
                }
            );

            let requestUrlMapper = this.requestUrlMapper || restMeta.requestUrlMapper || function (inUrl: string): string {
                return inUrl;
            };

            this[C_REST_RESOURCE + key] = this.$resource(requestUrlMapper(url), paramDefaults, restActions);
        };
    }
}


