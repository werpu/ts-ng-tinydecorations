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
    var C_BINDINGS = "__bindings__";
    var C_RESTFUL = "__restful__";
    var C_UDEF = "undefined";
    var C_INJECT = "$inject";
    exports.REST_ABORT = "__REST_ABORT__";
    var C_RESOURCE = "$resource";
    var C_TYPE_SERVICE = "__service__";
    var C_REST_RESOURCE = "__rest_res__";
    var C_REST_INIT = "__rest_init__";
    var C_SELECTOR = "__selector__";
    var C_NAME = "__name__";
    var C_VAL = "__value__";
    var C_RES_INJ = "__resourceinjected__";
    exports.POST_INIT = "__post_init__";
    exports.POST_INIT_EXECUTED = "__post_init__exec__";
    var genIdx = 0;
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
    /**
     * External registration manager
     * which allows to plug an external registration
     * into the core system
     *
     * @type {Array}
     */
    var RegistrationManager = /** @class */ (function () {
        function RegistrationManager() {
            this.registrationHandlers = [];
        }
        RegistrationManager.prototype.addRegistration = function (handler) {
            this.registrationHandlers.push(handler);
        };
        RegistrationManager.prototype.execute = function (alreadyProcessed, declarations /*decorated artifact*/, parentModuleClass /*current decorated class*/, configs /*optional config array*/, runs /*optional run array*/) {
            if (configs === void 0) { configs = []; }
            if (runs === void 0) { runs = []; }
            for (var decCnt = 0; declarations && decCnt < declarations.length; decCnt++) {
                var skipChain = false;
                var processIdx = "" + (declarations[decCnt].__genIdx__ || declarations[decCnt].prototype.__genIdx__);
                if (processIdx !== "undefined" && alreadyProcessed[processIdx]) {
                    continue;
                }
                for (var regCnt = 0, len = this.registrationHandlers.length; regCnt < len && !skipChain; regCnt++) {
                    skipChain = (this.registrationHandlers[regCnt](declarations[decCnt], parentModuleClass, configs, runs) === false);
                }
                if (!skipChain) {
                    throw Error("Declaration type not supported yet");
                }
                alreadyProcessed[processIdx] = true;
            }
            return alreadyProcessed;
        };
        return RegistrationManager;
    }());
    exports.RegistrationManager = RegistrationManager;
    exports.globalRegistrationManager = new RegistrationManager();
    //register component
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__component__) {
            var instance = new declaration();
            parentModuleClass.angularModule = parentModuleClass.angularModule.component(toCamelCase(instance[C_SELECTOR]), instance);
            return false;
        }
    });
    //register directive
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__directive__) {
            parentModuleClass.angularModule = parentModuleClass.angularModule.directive(toCamelCase(declaration[C_NAME]), function () {
                return instantiate(declaration, []);
            });
            return false;
        }
    });
    //register service
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration[C_TYPE_SERVICE]) {
            //subdeclaration of services
            //if it is a rest service it has its own rest generation routine attached
            //That way we can define on how to generate the rest code, via code injection
            //into the library from outside
            //theoretically you can define your own Rest annotation with special behavior that way
            if (declaration[C_RESTFUL]) {
                parentModuleClass.angularModule = parentModuleClass.angularModule.service(declaration[C_NAME], extended.decorateRestClass(declaration));
            }
            else {
                parentModuleClass.angularModule = parentModuleClass.angularModule.service(declaration[C_NAME], declaration);
            }
            return false;
        }
    });
    //register controller
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__controller__) {
            parentModuleClass.angularModule = parentModuleClass.angularModule.controller(declaration[C_NAME], declaration);
            return false;
        }
    });
    //register filter
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__filter__) {
            if (!declaration.prototype.filter) {
                //legacy filter code
                parentModuleClass.angularModule = parentModuleClass.angularModule.filter(declaration[C_NAME], declaration);
            }
            else {
                //new and improved filter method structure
                parentModuleClass.angularModule = parentModuleClass.angularModule.filter(declaration[C_NAME], declaration.$inject.concat([function () {
                        //if we have a filter function defined we are at our new structure
                        var instance = instantiate(declaration, arguments);
                        return function () {
                            return instance.filter.apply(instance, arguments);
                        };
                    }]));
            }
            return false;
        }
    });
    //register constant
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__constant__) {
            parentModuleClass.angularModule = parentModuleClass.angularModule.constant(declaration[C_NAME], declaration[C_VAL]);
            return false;
        }
    });
    //register constructor
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass) {
        if (declaration.__constructorHolder__ || declaration.prototype.__constructorHolder__) {
            //now this looks weird, but typescript resolves this in AMD differently
            //than with any ither loader
            var decl = (declaration.prototype.__constructorHolder__) ? declaration.prototype : declaration;
            for (var key in decl) {
                if (decl[key].__constant__) {
                    parentModuleClass.angularModule = parentModuleClass.angularModule.constant(decl[key][C_NAME], decl[key][C_VAL]);
                }
            }
            return false;
        }
    });
    //register config part
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass, configs) {
        if (configs === void 0) { configs = []; }
        if (declaration.__config__) {
            configs.push(declaration);
            return false;
        }
    });
    //register run part
    exports.globalRegistrationManager.addRegistration(function (declaration /*decorated artifact*/, parentModuleClass, configs, runs) {
        if (configs === void 0) { configs = []; }
        if (runs === void 0) { runs = []; }
        if (declaration.__run__) {
            runs.push(declaration);
            return false;
        }
    });
    function strip(inArr) {
        var retArr = [];
        if (C_UDEF == typeof inArr || null == inArr) {
            return inArr;
        }
        for (var cnt = 0, len = inArr.length; cnt < len; cnt++) {
            var element = inArr[cnt];
            if (C_UDEF != typeof element) {
                retArr.push(element);
            }
        }
        return retArr;
    }
    function PostConstruct() {
        return function (target, propertyName, descriptor) {
            target[exports.POST_INIT] = target[propertyName];
        };
    }
    exports.PostConstruct = PostConstruct;
    function executePostConstruct(_instance, ctor) {
        if (ctor.prototype[exports.POST_INIT] && !ctor.prototype[exports.POST_INIT_EXECUTED]) {
            ctor.prototype[exports.POST_INIT_EXECUTED] = true;
            ctor.prototype[exports.POST_INIT].apply(_instance, arguments);
        }
    }
    exports.executePostConstruct = executePostConstruct;
    /**
     * NgModule annotation
     *
     * NgModule is the central registration point
     * where all angular related artifacts are registered
     *
     * @param options: IModuleOptions
     */
    function NgModule(options) {
        var retVal = function (constructor) {
            var cls = /** @class */ (function () {
                function GenericModule() {
                    this.__module__ = true;
                    var imports = [];
                    for (var cnt = 0; options.imports && cnt < options.imports.length; cnt++) {
                        if ("String" == typeof options.imports[cnt] || typeof options.imports[cnt] instanceof String) {
                            imports.push(options.imports[cnt]);
                        }
                        else if (options.imports[cnt][C_NAME]) {
                            imports.push(options.imports[cnt][C_NAME]);
                        }
                        else {
                            imports.push(options.imports[cnt]);
                        }
                    }
                    cls.angularModule = angular.module(options.name, imports);
                    cls[C_NAME] = options.name;
                    var configs = [];
                    var runs = [];
                    //for now we treat declarations and exports and providers equally
                    //since angular1 does not know any artifact scopes
                    //angular2 however treats them differently
                    var alreadyProcessed = exports.globalRegistrationManager.execute({}, options.declarations, cls, configs, runs);
                    alreadyProcessed = exports.globalRegistrationManager.execute(alreadyProcessed, options.exports, cls, configs, runs);
                    exports.globalRegistrationManager.execute(alreadyProcessed, options.providers, cls, configs, runs);
                    for (var cnt = 0; cnt < configs.length; cnt++) {
                        cls.angularModule = cls.angularModule.config(configs[cnt][C_BINDINGS]);
                    }
                    for (var cnt = 0; cnt < runs.length; cnt++) {
                        cls.angularModule = cls.angularModule.run(runs[cnt][C_BINDINGS]);
                    }
                    executePostConstruct(this, constructor);
                }
                return GenericModule;
            }());
            new cls();
            return cls;
        };
        retVal.__genIdx__ = genIdx++;
        return retVal;
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
            retArr.push((cnt < target.length && C_UDEF != typeof target[cnt]) ? target[cnt] :
                (cnt < source.length && C_UDEF != typeof source[cnt]) ? source[cnt] : null);
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
                var mappedVal = (mapperFunc) ? mapperFunc(key) : undefined;
                var cDefMapped = C_UDEF != typeof mappedVal;
                if ((C_UDEF != typeof source[key] && overwrite) ||
                    (cDefMapped && overwrite) ||
                    (C_UDEF != typeof source[key] && (C_UDEF == typeof target[key] || null == target[key])) ||
                    (cDefMapped && (C_UDEF == typeof target[key] || null == target[key]))) {
                    var val = (cDefMapped) ? mappedVal : source[key];
                    if (C_UDEF != typeof val) {
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
        var retVal = function (constructor) {
            var _a;
            if ("string" == typeof options || options instanceof String) {
                options = {
                    name: options
                };
            }
            var cls = (_a = /** @class */ (function (_super) {
                    __extends(GenericModule, _super);
                    function GenericModule() {
                        var _this = _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                        executePostConstruct(_this, constructor);
                        return _this;
                    }
                    return GenericModule;
                }(constructor)),
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a.__restOptions__ = constructor.__restOptions__,
                _a.$inject = resolveInjections(constructor),
                _a.__genIdx__ = genIdx++,
                _a);
            cls[C_TYPE_SERVICE] = true;
            cls[C_RESTFUL] = !!constructor[C_RESTFUL];
            return cls;
        };
        return retVal;
    }
    exports.Injectable = Injectable;
    function Controller(options) {
        if ("string" == typeof options || options instanceof String) {
            options = {
                name: options
            };
        }
        var retVal = function (constructor) {
            var _a;
            var cls = (_a = /** @class */ (function (_super) {
                    __extends(GenericController, _super);
                    function GenericController() {
                        var _this = _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                        executePostConstruct(_this, constructor);
                        return _this;
                    }
                    return GenericController;
                }(constructor)),
                _a.__controller__ = true,
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a.__template__ = options.template,
                _a.__templateUrl__ = options.templateUrl,
                _a.__controllerAs__ = options.controllerAs || "",
                _a.__genIdx__ = genIdx++,
                _a.$inject = resolveInjections(constructor),
                _a);
            return cls;
        };
        return retVal;
    }
    exports.Controller = Controller;
    function Filter(options) {
        if ("string" == typeof options || options instanceof String) {
            options = {
                name: options
            };
        }
        var retVal = function (constructor) {
            var _a;
            var cls = (_a = /** @class */ (function (_super) {
                    __extends(GenericModule, _super);
                    function GenericModule() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GenericModule;
                }(constructor)),
                _a.__filter__ = true,
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a.__genIdx__ = genIdx++,
                _a);
            constructor.$inject = resolveInjections(constructor);
            return cls;
        };
        return retVal;
    }
    exports.Filter = Filter;
    /**
     * backport of the Angular4 component decorator
     * @param options
     * @returns {(constructor:T)=>any}
     * @constructor
     */
    function Component(options) {
        if ("string" == typeof options || options instanceof String) {
            options = {
                name: options
            };
        }
        var retVal = function (constructor) {
            var _a;
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat([constructor]);
            var tempBindings = constructor.prototype[C_BINDINGS] || {};
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            var cls = (_a = /** @class */ (function () {
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
                return key != C_INJECT;
            });
            constructor.prototype.__component__ = cls;
            cls.__genIdx__ = genIdx++;
            return cls;
        };
        return retVal;
    }
    exports.Component = Component;
    function Directive(options) {
        if ("string" == typeof options || options instanceof String) {
            options = {
                name: options
            };
        }
        var retVal = function (constructor) {
            var _a;
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat([constructor]);
            var tempBindings = constructor.prototype[C_BINDINGS] || {};
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
            var cls = (_a = /** @class */ (function () {
                    function GenericDirective() {
                        //class extends constructor {
                        this.template = function () {
                            return options.template || "";
                        };
                        this.controller = controllerBinding;
                        this.scope = (C_UDEF == typeof options.scope) ? ((Object.keys(tempBindings).length) ? tempBindings : undefined) : options.scope;
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
                        return (C_UDEF == typeof options.bindToController) ? true : options.bindToController;
                    case "multiElement":
                        return (C_UDEF == typeof options.multiElement) ? false : options.multiElement;
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
                return key != C_INJECT;
            });
            constructor.prototype.__component__ = cls;
            cls.__genIdx__ = genIdx++;
            return cls;
        };
        return retVal;
    }
    exports.Directive = Directive;
    function Config(options) {
        var retVal = function (constructor) {
            var _a;
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat(function () {
                instantiate(constructor, arguments);
            });
            var cls = (_a = /** @class */ (function () {
                    function GenericConfig() {
                    }
                    return GenericConfig;
                }()),
                _a.__config__ = true,
                _a.__bindings__ = controllerBinding,
                _a.__genIdx__ = genIdx++,
                _a);
            return cls;
        };
        return retVal;
    }
    exports.Config = Config;
    function Run(options) {
        var retVal = function (constructor) {
            var _a;
            var controllerBinding = [];
            controllerBinding = resolveInjections(constructor).concat(function () {
                instantiate(constructor, arguments);
            });
            var cls = (_a = /** @class */ (function () {
                    function GenericConfig() {
                    }
                    return GenericConfig;
                }()),
                _a.__run__ = true,
                _a.__bindings__ = controllerBinding,
                _a.__genIdx__ = genIdx++,
                _a);
            return cls;
        };
        retVal.__genIdx__ = genIdx++;
        return retVal;
    }
    exports.Run = Run;
    function Constant(name) {
        return function (target, propertyName) {
            var _a;
            var cls = (_a = /** @class */ (function () {
                    function GenericCons() {
                    }
                    return GenericCons;
                }()),
                _a.__constant__ = true,
                _a.__clazz__ = target,
                _a.__name__ = name || propertyName,
                _a.__genIdx__ = genIdx++,
                _a.__value__ = C_UDEF != typeof target[propertyName] ? target[propertyName] : new target.constructor()[propertyName],
                _a);
            target[propertyName] = cls;
            target.__constructorHolder__ = true;
        };
    }
    exports.Constant = Constant;
    function getBindings(target) {
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
    function getRequestMetaData(target, createIfNotExists) {
        if (createIfNotExists === void 0) { createIfNotExists = true; }
        return (createIfNotExists) ? getOrCreate(target, exports.C_REQ_META_DATA, function () {
            return {};
        }) : getOrCreate(target, exports.C_REQ_META_DATA, function () {
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
    function platformBrowserDynamic() {
        return {
            bootstrapModule: function (mainModule) {
                var bootstrapModule = (mainModule[C_NAME]) ? mainModule[C_NAME] : mainModule;
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
            ret.push(inArr[cnt][C_NAME] || inArr[cnt]);
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
    var extended;
    (function (extended) {
        var $resource = null;
        /**
         * config which can be overridden by the application
         *
         * @type {{url: string; method: (REST_TYPE | any); cancellable: boolean; cache: boolean}}
         */
        extended.DefaultRestMetaData = {
            method: exports.REST_TYPE.GET,
            cancellable: true,
            cache: false
        };
        //helper to init the param meta data with the appropriate names
        var initParamMetaData = function (paramMetaData, paramNames, pos) {
            if (!paramMetaData) {
                paramMetaData = {
                    name: paramNames[pos]
                };
            }
            else if (typeof paramMetaData === 'string' || paramMetaData instanceof String) {
                paramMetaData = {
                    name: paramMetaData
                };
            }
            else if (!paramMetaData.name) {
                paramMetaData.name = paramNames[pos];
            }
            if (paramMetaData)
                paramMetaData.pos = pos;
            return paramMetaData;
        };
        function RequestParam(paramMetaData) {
            return function (target, propertyName, pos) {
                //we can use an internal function from angular for the parameter parsing
                var paramNames = getAnnotator()(target[propertyName]);
                var finalParamMetaData = initParamMetaData(paramMetaData, paramNames, pos);
                getRequestParams(target[propertyName], paramNames.length)[pos] = (finalParamMetaData) ? finalParamMetaData : {
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
                var finalParamMetaData = initParamMetaData(paramMetaData, paramNames, pos);
                getPathVariables(target[propertyName], paramNames.length)[pos] = (finalParamMetaData) ? finalParamMetaData : {
                    name: paramNames[pos],
                    paramType: exports.PARAM_TYPE.URL,
                    pos: pos
                };
            };
        }
        extended.PathVariable = PathVariable;
        function RequestBody() {
            return function (target, propertyName, pos) {
                //we can use an internal function from angular for the parameter parsing
                var paramNames = getAnnotator()(target[propertyName]);
                getRequestBody(target[propertyName]);
                getRequestMetaData(target[propertyName])[exports.C_REQ_BODY] = {
                    paramType: exports.PARAM_TYPE.BODY,
                    pos: pos
                };
            };
        }
        extended.RequestBody = RequestBody;
        /**
         * Restable annotation
         * allows to class system wide rest annotations
         * @param {extended.IDefaultRestMetaData} options
         * @returns {(constructor: AngularCtor<Object>) => any}
         * @constructor
         */
        function Restable(options) {
            return function (constructor) {
                var _a;
                if (!options) {
                    return constructor;
                }
                var cls = (_a = /** @class */ (function (_super) {
                        __extends(GenericModule, _super);
                        function GenericModule() {
                            return _super.apply(this, [].slice.call(arguments).slice(0, arguments.length)) || this;
                        }
                        return GenericModule;
                    }(constructor)),
                    _a.__restOptions__ = options || {},
                    _a);
                cls[C_RESTFUL] = true;
                return cls;
            };
        }
        extended.Restable = Restable;
        function Rest(restMetaData) {
            return function (target, propertyName, descriptor) {
                var reqMeta = getRequestMetaData(target[propertyName]);
                //the entire meta data is attached to the function/method target.propertyName
                if (typeof restMetaData === 'string' || restMetaData instanceof String) {
                    restMetaData = {
                        url: restMetaData
                    };
                }
                if (restMetaData) {
                    //we map the defaults in if they are not set
                    //map<IDefaultRestMetaData>( {}, DefaultRestMetaData, restMetaData, false);
                    map({}, restMetaData, reqMeta, true);
                }
                if (!target.constructor[C_RESTFUL]) {
                    target.constructor[C_RESTFUL] = true;
                }
            };
        }
        extended.Rest = Rest;
        function decorateRestClass(clazz) {
            var fullService = /** @class */ (function (_super) {
                __extends(GenericRestService, _super);
                function GenericRestService() {
                    var _this = _super.apply(this, [].slice.call(arguments).slice(1, arguments.length)) || this;
                    _this.__restOptions__ = clazz.__restOptions__;
                    //the super constructor did not have assigned a resource
                    //we use our own
                    if (!_this.$resource) {
                        _this.$resource = arguments[0];
                    }
                    //init the rest init methods
                    for (var key in clazz.prototype) {
                        var restMeta = getRequestMetaData(clazz.prototype[key], false);
                        //no rest annotation we simply dont do anything
                        if (!restMeta) {
                            continue;
                        }
                        _this[C_REST_INIT + key]();
                    }
                    executePostConstruct(_this, clazz);
                    return _this;
                }
                return GenericRestService;
            }(clazz));
            for (var key in clazz.prototype) {
                var restMeta = getRequestMetaData(clazz.prototype[key], false);
                //no rest annotation we simply dont do anything
                if (!restMeta) {
                    continue;
                }
                decorateRestFunction(fullService, key, clazz, restMeta);
            }
            //if (!(<any>fullService).$inject || (<any>fullService).$inject.indexOf("$resource") == -1) {
            //we always auto inject a resource
            fullService.$inject = [C_RESOURCE].concat(fullService.$inject || []);
            //}
            return fullService;
        }
        extended.decorateRestClass = decorateRestClass;
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
                        var value = (cnt < arguments.length && C_UDEF != arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                            ((C_UDEF != param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined);
                        var val_udef = C_UDEF == typeof value;
                        if (!val_udef) {
                            paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc.call(this, value) : value;
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
                        var value = (cnt < arguments.length && C_UDEF != arguments[param.pos || 0]) ? arguments[param.pos || 0] :
                            ((C_UDEF != param.defaultValue) ? param.defaultValue :
                                (param.defaultValueFunc) ? param.defaultValueFunc : undefined);
                        var val_udef = C_UDEF == typeof value;
                        if (!val_udef) {
                            paramsMap[param.name] = (param.conversionFunc) ? param.conversionFunc.call(this, value) : value;
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
                    if (C_UDEF != typeof body) {
                        body = restMeta[exports.C_REQ_BODY].conversionFunc ? restMeta[exports.C_REQ_BODY].conversionFunc.call(this, body) : body;
                    }
                    //TODO we need also to return a fixed promise
                    //data in -> data out for the decorator call
                    var retPromise = (C_UDEF != typeof body) ?
                        (restMeta.decorator) ? restMeta.decorator.call(this, this[C_REST_RESOURCE + key][restMeta.method || exports.REST_TYPE.GET](paramsMap, body)) : this[C_REST_RESOURCE + key][restMeta.method || exports.REST_TYPE.GET](paramsMap, body).$promise :
                        (restMeta.decorator) ? restMeta.decorator.call(this, this[C_REST_RESOURCE + key][restMeta.method || exports.REST_TYPE.GET](paramsMap, {})) : this[C_REST_RESOURCE + key][restMeta.method || exports.REST_TYPE.GET](paramsMap, {}).$promise;
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
                var mappedParams = {};
                var paramDefaults = {};
                var pathVars = strip(restMeta[exports.C_PATH_VARIABLES]);
                var pathVariables = [];
                for (var cnt = 0; pathVars && cnt < pathVars.length; cnt++) {
                    pathVariables.push(":" + pathVars[cnt].name);
                    mappedParams[pathVars[cnt].name] = "@" + pathVars[cnt].name;
                    if (C_UDEF != typeof pathVars[cnt].defaultValue) {
                        paramDefaults[pathVars[cnt].name] = pathVars[cnt].defaultValue;
                    }
                }
                var reqParams = strip(restMeta[exports.C_REQ_PARAMS]);
                for (var cnt = 0; reqParams && cnt < reqParams.length; cnt++) {
                    var param = reqParams[cnt];
                    mappedParams[param.name] = "@" + param.name;
                    if (C_UDEF != typeof param.defaultValue) {
                        paramDefaults[param.name] = param.defaultValue;
                    }
                }
                //defaults first the local one from the outer service
                map({}, this.__restOptions__ || {}, restMeta, false);
                //and if that one does not exist the one from the default settings
                map({}, extended.DefaultRestMetaData, restMeta, false);
                var url = (this.$rootUrl || restMeta.$rootUrl || "") + restMeta.url + ((pathVariables.length) ? "/" + pathVariables.join("/") : "");
                var restActions = {};
                var method = restMeta.method || "GET";
                restActions[method] = {};
                var _t = this;
                //we apply all defaults, first the service default then the global default
                map({
                    method: 1,
                    cache: 1,
                    isArray: 1,
                    cancellable: 1,
                    requestBody: 1
                }, /*reqired mappings always returning a value*/ restMeta, /*source*/ restActions[method], /*target*/ false, /*overwrite*/ function (key) {
                    return (key != "url") && (key != "decorator");
                }, //mapping allowed?
                function (key) {
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
                            return restMeta.transformResponse ? function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return restMeta.transformResponse.apply(_t, args);
                            } : undefined;
                        case "requestBody":
                            return !!restMeta[exports.C_REQ_BODY];
                        default:
                            return restMeta[key];
                    }
                });
                var requestUrlMapper = this.requestUrlMapper || restMeta.requestUrlMapper || function (inUrl) { return inUrl; };
                this[C_REST_RESOURCE + key] = this.$resource(requestUrlMapper(url), paramDefaults, restActions);
            };
        }
    })(extended = exports.extended || (exports.extended = {}));
});
//# sourceMappingURL=TinyDecorations.js.map