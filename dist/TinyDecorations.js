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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * internal constants
     * @type {string}
     */
    exports.C_INJECTIONS = "__injections__";
    exports.C_REQ_PARAMS = "__request_params__";
    exports.C_PATH_VARIABLES = "__path_variables__";
    exports.C_REQ_BODY = "__request_body__";
    exports.C_REQ_META_DATA = "__request_meta__";
    exports.C_BINDINGS = "__bindings__";
    exports.C_RESTFUL = "__restful__";
    exports.C_UDEF = "undefined";
    exports.C_INJECT = "$inject";
    exports.C_TYPE_SERVICE = "__service__";
    exports.C_REST_RESOURCE = "__rest_res__";
    exports.C_REST_INIT = "__rest_init__";
    exports.REST_ABORT = "__REST_ABORT__";
    exports.PARAM_TYPE = {
        URL: "URL",
        REQUEST: "REQUEST",
        BODY: "BODY"
    };
    exports.REST_TYPE = {
        POST: "POST",
        GET: "GET",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE"
    };
    function register(declarations, cls, configs, runs) {
        if (configs === void 0) { configs = []; }
        if (runs === void 0) { runs = []; }
        var _loop_1 = function (cnt) {
            var declaration = declarations[cnt];
            if (declaration.__component__) {
                var instance = new declaration();
                cls.angularModule = cls.angularModule.component(toCamelCase(instance.__selector__), instance);
            }
            else if (declaration.__directive__) {
                cls.angularModule = cls.angularModule.directive(toCamelCase(declaration.__name__), function () {
                    return instantiate(declaration, []);
                });
            }
            else if (declaration[exports.C_TYPE_SERVICE]) {
                //subdeclaration of services
                //if it is a rest service it has its own rest generation routine attached
                //That way we can define on how to generate the rest code, via code injection
                //into the library from outside
                //theoretically you can define your own Rest annotation with special behavior that way
                if (declaration[exports.C_RESTFUL]) {
                    cls.angularModule = cls.angularModule.service(declaration.__name__, declaration[exports.C_RESTFUL](declaration.__clazz__));
                }
                else {
                    cls.angularModule = cls.angularModule.service(declaration.__name__, declaration.__clazz__);
                }
            }
            else if (declaration.__controller__) {
                cls.angularModule = cls.angularModule.controller(declaration.__name__, declaration.__clazz__);
            }
            else if (declaration.__filter__) {
                if (!declaration.prototype.filter) {
                    //legacy filter code
                    cls.angularModule = cls.angularModule.filter(declaration.__name__, declaration);
                }
                else {
                    //new and improved filter method structure
                    cls.angularModule = cls.angularModule.filter(declaration.__name__, declaration.$inject.concat([function () {
                            //if we have a filter function defined we are at our new structure
                            var instance = instantiate(declaration, arguments);
                            return function () {
                                return instance.filter.apply(instance, arguments);
                            };
                        }]));
                }
            }
            else if (declaration.__constant__) {
                cls.angularModule = cls.angularModule.constant(declaration.__name__, declaration.__value__);
            }
            else if (declaration.__constructorHolder__ || declaration.prototype.__constructorHolder__) {
                //now this looks weird, but typescript resolves this in AMD differently
                //than with any ither loader
                var decl = (declaration.prototype.__constructorHolder__) ? declaration.prototype : declaration;
                for (var key in decl) {
                    if (decl[key].__constant__) {
                        cls.angularModule = cls.angularModule.constant(decl[key].__name__, decl[key].__value__);
                    }
                }
            }
            else if (declaration.__config__) {
                configs.push(declaration);
            }
            else if (declaration.__run__) {
                runs.push(declaration);
            }
            else {
                throw Error("Declaration type not supported yet");
            }
        };
        for (var cnt = 0; declarations && cnt < declarations.length; cnt++) {
            _loop_1(cnt);
        }
    }
    function strip(inArr) {
        var retArr = [];
        if (exports.C_UDEF == typeof inArr || null == inArr) {
            return inArr;
        }
        for (var cnt = 0, len = inArr.length; cnt < len; cnt++) {
            var element = inArr[cnt];
            if (exports.C_UDEF != typeof element) {
                retArr.push(element);
            }
        }
        return retArr;
    }
    /**
     * NgModule annotation
     * @param options: IModuleOptions
     */
    function NgModule(options) {
        return function (constructor) {
            var cls = (function () {
                function GenericModule() {
                    this.__module__ = true;
                    var imports = [];
                    for (var cnt = 0; options.imports && cnt < options.imports.length; cnt++) {
                        if ("String" == typeof options.imports[cnt] || typeof options.imports[cnt] instanceof String) {
                            imports.push(options.imports[cnt]);
                        }
                        else if (options.imports[cnt].__name__) {
                            imports.push(options.imports[cnt].__name__);
                        }
                        else {
                            imports.push(options.imports[cnt]);
                        }
                    }
                    cls.angularModule = angular.module(options.name, imports);
                    cls.__name__ = options.name;
                    var configs = [];
                    var runs = [];
                    register(options.declarations, cls, configs, runs);
                    register(options.exports, cls, configs, runs);
                    for (var cnt = 0; cnt < configs.length; cnt++) {
                        cls.angularModule = cls.angularModule.config(configs[cnt].__bindings__);
                    }
                    for (var cnt = 0; cnt < runs.length; cnt++) {
                        cls.angularModule = cls.angularModule.run(runs[cnt].__bindings__);
                    }
                }
                return GenericModule;
            }());
            new cls();
            return cls;
        };
    }
    exports.NgModule = NgModule;
    /**
     * sideffect free mixing function which mixes two arrays
     *
     * @param source
     * @param target
     * @returns {Array<any>}
     */
    function mixin(source, target) {
        var retArr = [];
        for (var cnt = 0; cnt < Math.max(source.length, target.length); cnt++) {
            retArr.push((cnt < target.length && exports.C_UDEF != typeof target[cnt]) ? target[cnt] :
                (cnt < source.length && exports.C_UDEF != typeof source[cnt]) ? source[cnt] : null);
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
    function map(requiredKeys, source, target, overwrite, mappingAllowed, mapperFunc) {
        var map = (requiredKeys || {});
        for (var key in source) {
            map[key] = 1;
        }
        for (var key in map) {
            if (!mappingAllowed || mappingAllowed(key)) {
                if ((exports.C_UDEF != typeof source[key] && overwrite) ||
                    (exports.C_UDEF != typeof source[key] && (exports.C_UDEF == typeof target[key] || null == target[key]))) {
                    var val = (mapperFunc) ? mapperFunc(key) : source[key];
                    if (exports.C_UDEF != typeof val) {
                        target[key] = val;
                    }
                }
            }
        }
    }
    function resolveInjections(constructor) {
        var params = getAnnotator()(constructor);
        return mixin(params, resolveRequires(constructor[exports.C_INJECTIONS]));
    }
    function Injectable(options) {
        return function (constructor) {
            var cls = (_a = (function (_super) {
                    __extends(GenericModule, _super);
                    function GenericModule() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GenericModule;
                }(constructor)),
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a);
            cls[exports.C_TYPE_SERVICE] = true;
            //an external injection could be set before we resolve our own injections
            constructor.$inject = resolveInjections(constructor);
            return cls;
            var _a;
        };
    }
    exports.Injectable = Injectable;
    function Controller(options) {
        return function (constructor) {
            var cls = (_a = (function (_super) {
                    __extends(GenericController, _super);
                    function GenericController() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GenericController;
                }(constructor)),
                _a.__controller__ = true,
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a.__template__ = options.template,
                _a.__templateUrl__ = options.templateUrl,
                _a.__controllerAs__ = options.controllerAs || "",
                _a);
            constructor.$inject = resolveInjections(constructor);
            return cls;
            var _a;
        };
    }
    exports.Controller = Controller;
    function Filter(options) {
        return function (constructor) {
            var cls = (_a = (function (_super) {
                    __extends(GenericModule, _super);
                    function GenericModule() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GenericModule;
                }(constructor)),
                _a.__filter__ = true,
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a);
            constructor.$inject = resolveInjections(constructor);
            return cls;
            var _a;
        };
    }
    exports.Filter = Filter;
    /**
     * backport of the Angular4 component decorator
     * @param options
     * @returns {(constructor:T)=>any}
     * @constructor
     */
    function Component(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat([constructor]);
            var tempBindings = constructor.prototype[exports.C_BINDINGS] || {};
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            var cls = (_a = (function () {
                    function GenericComponent() {
                        this.__selector__ = options.selector;
                        //special cases without auto remapping
                        this.bindings = tempBindings;
                        this.controller = controllerBinding;
                    }
                    return GenericComponent;
                }()),
                _a.__component__ = true,
                _a);
            /*we remap the properties*/
            map({
                selector: 1,
                controllerAs: 1,
                transclude: 1
            }, options, cls.prototype, true, function (key) {
                return true;
            }, function (key) {
                switch (key) {
                    case "selector":
                        return undefined;
                    case "controllerAs":
                        return options.controllerAs || "";
                    case "transclude":
                        return options.transclude || false;
                    default:
                        return options[key];
                }
            });
            //we transfer the static variables since we cannot derive atm
            map({}, constructor, cls, true, function (key) {
                return key != exports.C_INJECT;
            });
            constructor.prototype.__component__ = cls;
            return cls;
            var _a;
        };
    }
    exports.Component = Component;
    function Directive(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat([constructor]);
            var tempBindings = constructor.prototype[exports.C_BINDINGS] || {};
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            var cls = (_a = (function () {
                    function GenericDirective() {
                        //class extends constructor {
                        this.template = function () {
                            return options.template || "";
                        };
                        this.controller = controllerBinding;
                        this.scope = (exports.C_UDEF == typeof options.scope) ? ((Object.keys(tempBindings).length) ? tempBindings : undefined) : options.scope;
                    }
                    return GenericDirective;
                }()),
                _a.__directive__ = true,
                _a.__bindings__ = tempBindings,
                _a.__name__ = options.selector,
                _a);
            /*we remap the properties*/
            map({
                selector: 1,
                controllerAs: 1,
                transclude: 1,
                restrict: 1,
                priority: 1,
                replace: 1,
                bindToController: 1,
                multiElement: 1,
                link: 1
            }, options, cls.prototype, true, function (key) {
                return true;
            }, function (key) {
                switch (key) {
                    case "selector":
                        return undefined;
                    case "controllerAs":
                        return options.controllerAs || "";
                    case "transclude":
                        return options.transclude || false;
                    case "restrict":
                        return options.restrict || "E";
                    case "priority":
                        return options.priority || 0;
                    case "replace":
                        return !!options.replace;
                    case "bindToController":
                        return (exports.C_UDEF == typeof options.bindToController) ? true : options.bindToController;
                    case "multiElement":
                        return (exports.C_UDEF == typeof options.multiElement) ? false : options.multiElement;
                    case "link":
                        return (constructor.prototype.link && !constructor.prototype.preLink) ? function () {
                            constructor.prototype.link.apply(arguments[3], arguments);
                        } : undefined;
                    default:
                        return options[key];
                }
            });
            //prelink postlink handling
            if (constructor.prototype.compile || constructor.prototype.preLink || constructor.prototype.postLink) {
                cls.prototype["compile"] = function () {
                    if (constructor.prototype.compile) {
                        return constructor.prototype.compile.prototype.apply(this, arguments);
                    }
                    else {
                        var retOpts = {};
                        if (constructor.prototype.preLink) {
                            retOpts["pre"] = function () {
                                constructor.prototype.preLink.apply(arguments[3], arguments);
                            };
                        }
                        //link and postlink are the same they more or less exclude each other
                        if (constructor.prototype.postLink && constructor.prototype.link) {
                            throw new Error("You cannot set postlink and link at the same time, they are mutually exclusive" +
                                " and basically the same. Directive: " + options.selector);
                        }
                        if (constructor.prototype.postLink || constructor.prototype.link) {
                            retOpts["post"] = function () {
                                if (constructor.prototype.postLink) {
                                    constructor.prototype.postLink.apply(arguments[3], arguments);
                                }
                                else {
                                    constructor.prototype.link.apply(arguments[3], arguments);
                                }
                            };
                        }
                        return retOpts;
                    }
                };
            }
            //transfer static variables
            map({}, constructor, cls, true, function (key) {
                return key != exports.C_INJECT;
            });
            constructor.prototype.__component__ = cls;
            return cls;
            var _a;
        };
    }
    exports.Directive = Directive;
    function Config(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat(function () {
                instantiate(constructor, arguments);
            });
            var cls = (_a = (function () {
                    function GenericConfig() {
                    }
                    return GenericConfig;
                }()),
                _a.__config__ = true,
                _a.__bindings__ = controllerBinding,
                _a);
            return cls;
            var _a;
        };
    }
    exports.Config = Config;
    function Run(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat(function () {
                instantiate(constructor, arguments);
            });
            var cls = (_a = (function () {
                    function GenericConfig() {
                    }
                    return GenericConfig;
                }()),
                _a.__run__ = true,
                _a.__bindings__ = controllerBinding,
                _a);
            return cls;
            var _a;
        };
    }
    exports.Run = Run;
    function Constant(name) {
        return function (target, propertyName) {
            var cls = (_a = (function () {
                    function GenericCons() {
                    }
                    return GenericCons;
                }()),
                _a.__constant__ = true,
                _a.__clazz__ = target,
                _a.__name__ = name || propertyName,
                _a.__value__ = exports.C_UDEF != typeof target[propertyName] ? target[propertyName] : new target.constructor()[propertyName],
                _a);
            target[propertyName] = cls;
            target.__constructorHolder__ = true;
            var _a;
        };
    }
    exports.Constant = Constant;
    function getBindings(target) {
        if (!target.constructor.prototype[exports.C_BINDINGS]) {
            target.constructor.prototype[exports.C_BINDINGS] = {};
        }
        return target.constructor.prototype[exports.C_BINDINGS];
    }
    /**
     * Input property decorator maps to bindings.property = "<"
     * @param optional if set to true an optional param is used instead aka "<?"
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Input(optional) {
        if (optional === void 0) { optional = false; }
        return function (target, propertyName) {
            getBindings(target)[propertyName] = (optional) ? "<?" : "<";
        };
    }
    exports.Input = Input;
    /**
     * Bidirectional binding aka "="
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Both(optional) {
        if (optional === void 0) { optional = false; }
        function decorator(target, propertyName) {
            getBindings(target)[propertyName] = (optional) ? "=?" : "=";
        }
        return decorator;
    }
    exports.Both = Both;
    /**
     * Outjection binding aka "="
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Out(optional) {
        if (optional === void 0) { optional = false; }
        function decorator(target, propertyName) {
            getBindings(target)[propertyName] = (optional) ? "<?" : "<";
        }
        return decorator;
    }
    exports.Out = Out;
    /**
     * Functional binding aka "&"
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Func(optional) {
        if (optional === void 0) { optional = false; }
        return function (target, propertyName) {
            getBindings(target)[propertyName] = (optional) ? "&?" : "&";
        };
    }
    exports.Func = Func;
    /**
     * string binding aka "&"
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function AString(optional) {
        if (optional === void 0) { optional = false; }
        return function (target, propertyName) {
            getBindings(target)[propertyName] = (optional) ? "@?" : "@";
        };
    }
    exports.AString = AString;
    /**
     * helper function  which determines the injector annotate function
     *
     * @returns {any|((fn:Function, strictDi?:boolean)=>string[])|((inlineAnnotatedFunction:any[])=>string[])}
     */
    var getAnnotator = function () {
        return angular.injector.$$annotate || angular.injector.annotate;
    };
    /**
     * injection (other way to inject than requires)
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Inject(artifact) {
        return function (target, propertyName, pos) {
            //we can use an internal function from angular for the parameter parsing
            var paramNames = getAnnotator()(target);
            getInjections(target, paramNames.length)[pos] = (artifact) ? artifact : paramNames[pos];
        };
    }
    exports.Inject = Inject;
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
    function getOrCreate(target, propertyKey, factory) {
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
    function getInjections(target, numberOfParams) {
        return getOrCreate(target, exports.C_INJECTIONS, function () {
            return new Array(numberOfParams);
        });
    }
    /**
     * fetches the request metadata attached to the taerget
     *
     * @param target
     * @returns {any}
     */
    function getRequestMetaData(target) {
        return getOrCreate(target, exports.C_REQ_META_DATA, function () {
            return {};
        });
    }
    function getRequestParams(target, numberOfParams) {
        var metaData = getRequestMetaData(target);
        return getOrCreate(metaData, exports.C_REQ_PARAMS, function () {
            return new Array(numberOfParams);
        });
    }
    function getPathVariables(target, numberOfParams) {
        var metaData = getRequestMetaData(target);
        return getOrCreate(metaData, exports.C_PATH_VARIABLES, function () {
            return new Array(numberOfParams);
        });
    }
    function getRequestBody(target) {
        var metaData = getRequestMetaData(target);
        if (metaData[exports.C_REQ_BODY]) {
            throw Error("Only one @RequestBody per method allowed");
        }
        return metaData[exports.C_REQ_BODY] = {};
    }
    /**
     * helper to reduce the ui route code
     * @param $stateProvider
     * @param controller
     * @param name
     * @param url
     * @param security
     */
    function route($stateProvider, controller, name, url, security, routes) {
        if (!controller.__controller__) {
            throw Error("controller is not an annotated controller");
        }
        var routeData = {
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
        var retVal = $stateProvider.state(name, routeData);
        retVal.route = function (controller, name, url, security) {
            return route(retVal, controller, name, url, security);
        };
        return retVal;
    }
    exports.route = route;
    function uiRoute($routeProvider, controller, route) {
        $routeProvider.when(route, {
            template: controller.__template__,
            controller: controller.__name__,
            controllerAs: controller.__controllerAs__ || "ctrl",
            templateUrl: controller.__templateUrl__
        });
    }
    exports.uiRoute = uiRoute;
    function platformBrowserDynamic() {
        return {
            bootstrapModule: function (mainModule) {
                var bootstrapModule = (mainModule.__name__) ? mainModule.__name__ : mainModule;
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [bootstrapModule]);
                });
            }
        };
    }
    exports.platformBrowserDynamic = platformBrowserDynamic;
    /**
     * helper for the compiler to keep external modules
     *
     * @param params
     */
    function keepExternals() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
    }
    exports.keepExternals = keepExternals;
    //------------------- helpers ------------------------------------------
    function resolveRequires(inArr) {
        var ret = [];
        if (!inArr) {
            return [];
        }
        for (var cnt = 0; cnt < inArr.length; cnt++) {
            if (!inArr[cnt]) {
                continue;
            }
            ret.push(inArr[cnt].__name__ || inArr[cnt]);
        }
        return ret;
    }
    function toCamelCase(tagName) {
        var splittedTagName = tagName.split("-");
        var camelCaseName = [];
        camelCaseName.push(splittedTagName[0]);
        for (var cnt = 1; cnt < splittedTagName.length; cnt++) {
            camelCaseName.push(splittedTagName[cnt].substr(0, 1).toUpperCase());
            camelCaseName.push(splittedTagName[cnt].substr(1, splittedTagName[cnt].length - 1));
        }
        return camelCaseName.join("");
    }
    //https://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
    function instantiate(ctor, args) {
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
    var extended;
    (function (extended) {
        var $resource = null;
        //TODO
        function RequestParam(paramMetaData) {
            return function (target, propertyName, pos) {
                //we can use an internal function from angular for the parameter parsing
                var paramNames = getAnnotator()(target[propertyName]);
                if (paramMetaData)
                    paramMetaData.pos = pos;
                getRequestParams(target[propertyName], paramNames.length)[pos] = (paramMetaData) ? paramMetaData : {
                    name: paramNames[pos],
                    paramType: exports.PARAM_TYPE.URL,
                    pos: pos
                };
            };
        }
        extended.RequestParam = RequestParam;
        function PathVariable(paramMetaData) {
            return function (target, propertyName, pos) {
                //we can use an internal function from angular for the parameter parsing
                var paramNames = getAnnotator()(target[propertyName]);
                if (paramMetaData)
                    paramMetaData.pos = pos;
                getPathVariables(target[propertyName], paramNames.length)[pos] = (paramMetaData) ? paramMetaData : {
                    name: paramNames[pos],
                    paramType: exports.PARAM_TYPE.URL,
                    pos: pos
                };
            };
        }
        extended.PathVariable = PathVariable;
        function RequestBody(paramMetaData) {
            return function (target, propertyName, pos) {
                //we can use an internal function from angular for the parameter parsing
                var paramNames = getAnnotator()(target[propertyName]);
                getRequestBody(target[propertyName]);
                if (paramMetaData)
                    paramMetaData.pos = pos;
                getRequestMetaData(target[propertyName])[exports.C_REQ_BODY] = (paramMetaData) ? paramMetaData : {
                    name: paramNames[pos],
                    paramType: exports.PARAM_TYPE.URL,
                    pos: pos
                };
            };
        }
        extended.RequestBody = RequestBody;
        function Rest(restMetaData) {
            return function (target, propertyName, descriptor) {
                var reqMeta = getRequestMetaData(target[propertyName]);
                //the entire meta data is attached to the function/method target.propertyName
                if (restMetaData) {
                    map({}, restMetaData, reqMeta, true);
                }
                target.constructor[exports.C_RESTFUL] = generateRestCode;
            };
        }
        extended.Rest = Rest;
        function generateRestCode(clazz) {
            var fullService = (function (_super) {
                __extends(GenericRestService, _super);
                function GenericRestService() {
                    var _this = _super.apply(this, [].slice.call(arguments).slice(1, arguments.length)) || this;
                    //the super constructor did not have assigned a resource
                    //we use our own
                    if (!_this.$resource) {
                        _this.$resource = arguments[0];
                    }
                    //init the rest init methods
                    for (var key in clazz.prototype) {
                        var restMeta = getRequestMetaData(clazz.prototype[key]);
                        //no rest annotation we simply dont do anything
                        if (!restMeta) {
                            continue;
                        }
                        _this[exports.C_REST_INIT + key]();
                    }
                    return _this;
                }
                return GenericRestService;
            }(clazz));
            for (var key in clazz.prototype) {
                var restMeta = getRequestMetaData(clazz.prototype[key]);
                //no rest annotation we simply dont do anything
                if (!restMeta) {
                    continue;
                }
                decorateRestFunction(fullService, key, clazz, restMeta);
            }
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
        function decorateRestFunction(target, key, clazz, restMeta) {
            //rest annotation found
            //First super call
            //and if the call does not return a REST_ABORT return value
            //we proceed by dynamically building up our rest resource call
            if (!target["__resourceinjected__"]) {
                target.$inject = ["$resource"].concat(target.$inject || []);
                target["__resourceinjected__"] = true;
            }
            target.prototype[key] = function () {
                if (clazz.prototype[key].apply(this, arguments) === exports.REST_ABORT) {
                    return;
                }
                else {
                    var paramsMap = {};
                    var pathVars = strip(restMeta[exports.C_PATH_VARIABLES]);
                    var valueCnt = 0;
                    for (var cnt = 0; pathVars && cnt < pathVars.length; cnt++) {
                        var param = pathVars[cnt];
                        var value = (cnt < arguments.length && exports.C_UDEF != arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                            ((exports.C_UDEF != param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined);
                        var val_udef = exports.C_UDEF == typeof value;
                        if (!val_udef) {
                            paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc(value) : value;
                        }
                        else if (val_udef && param.optional) {
                            continue;
                        }
                        else {
                            throw new Error("Required parameter has no value: method " + key);
                        }
                        valueCnt++;
                    }
                    var reqParams = strip(restMeta[exports.C_REQ_PARAMS]);
                    for (var cnt = 0; reqParams && cnt < reqParams.length; cnt++) {
                        var param = reqParams[cnt];
                        var value = (cnt < arguments.length && exports.C_UDEF != arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                            ((exports.C_UDEF != param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined);
                        var val_udef = exports.C_UDEF == typeof value;
                        if (!val_udef) {
                            paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc(value) : value;
                        }
                        else if (val_udef && param.optional) {
                            continue;
                        }
                        else {
                            throw new Error("Required parameter has no value: method " + key);
                        }
                        valueCnt++;
                    }
                    var body = (restMeta[exports.C_REQ_BODY]) ? arguments[restMeta[exports.C_REQ_BODY].pos || 0] : undefined;
                    if (exports.C_UDEF != typeof body) {
                        body = restMeta[exports.C_REQ_BODY].conversionFunc ? restMeta[exports.C_REQ_BODY].conversionFunc(body) : body;
                    }
                    var retPromise = this[exports.C_REST_RESOURCE + key][restMeta.method || exports.REST_TYPE.GET](paramsMap, body).$promise;
                    //list but not least we transform/decorate the promise from outside if requested
                    return (restMeta.transformPromise) ? restMeta.transformPromise(retPromise) : retPromise;
                }
            };
            target.prototype[exports.C_REST_INIT + key] = function () {
                if (!(this.$resource)) {
                    throw Error("rest injectible must have a $resource instance variable");
                }
                //if(!this.$resource) {
                //    this.$resource = <any> angular.injector().get("$resource");
                //}
                var mappedParams = {};
                var paramDefaults = {};
                var pathVars = strip(restMeta[exports.C_PATH_VARIABLES]);
                var pathVariables = [];
                for (var cnt = 0; pathVars && cnt < pathVars.length; cnt++) {
                    pathVariables.push(":" + pathVars[cnt].name);
                    mappedParams[pathVars[cnt].name] = "@" + pathVars[cnt].name;
                    if (exports.C_UDEF != typeof pathVars[cnt].defaultValue) {
                        paramDefaults[pathVars[cnt].name] = pathVars[cnt].defaultValue;
                    }
                }
                var reqParams = strip(restMeta[exports.C_REQ_PARAMS]);
                for (var cnt = 0; reqParams && cnt < reqParams.length; cnt++) {
                    if (exports.C_UDEF == typeof reqParams[cnt]) {
                        continue;
                    }
                    var param = reqParams[cnt];
                    mappedParams[param.name] = "@" + param.name;
                    if (exports.C_UDEF != typeof param.defaultValue) {
                        paramDefaults[param.name] = param.defaultValue;
                    }
                }
                var url = (this.$rootUrl || "") + restMeta.url + ((pathVariables.length) ? "/" + pathVariables.join("/") : "");
                var restActions = {};
                restActions[restMeta.method || "GET"] = { method: restMeta.method || "GET", cache: restMeta.cache, isArray: restMeta.isArray };
                this[exports.C_REST_RESOURCE + key] = this.$resource(url, paramDefaults, restActions);
            };
        }
    })(extended = exports.extended || (exports.extended = {}));
});
//# sourceMappingURL=TinyDecorations.js.map