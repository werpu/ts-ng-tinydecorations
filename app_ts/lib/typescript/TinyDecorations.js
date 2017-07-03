/// <reference path="../typings/test.d.ts" />
/*
 Copyright 2017 Werner Punz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
System.register([], function (exports_1, context_1) {
    "use strict";
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
    var __moduleName = context_1 && context_1.id;
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
                    var _loop_1 = function (cnt) {
                        var declaration = options.declarations[cnt];
                        if (declaration.__component__) {
                            var instance = new declaration();
                            cls.angularModule = cls.angularModule.component(toCamelCase(instance.__selector__), instance);
                        }
                        else if (declaration.__directive__) {
                            cls.angularModule = cls.angularModule.directive(toCamelCase(declaration.__name__), declaration.__bindings__.concat([function () {
                                    return instantiate(declaration, arguments);
                                }]));
                        }
                        else if (declaration.__service__) {
                            cls.angularModule = cls.angularModule.service(declaration.__name__, declaration.__clazz__);
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
                    for (var cnt = 0; options.declarations && cnt < options.declarations.length; cnt++) {
                        _loop_1(cnt);
                    }
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
    exports_1("NgModule", NgModule);
    function Injectable(options) {
        return function (constructor) {
            var cls = (_a = (function (_super) {
                    __extends(GenericModule, _super);
                    function GenericModule() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GenericModule;
                }(constructor)),
                _a.__service__ = true,
                _a.__clazz__ = constructor,
                _a.__name__ = options.name,
                _a);
            constructor.$inject = resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__));
            return cls;
            var _a;
        };
    }
    exports_1("Injectable", Injectable);
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
            constructor.$inject = resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__));
            return cls;
            var _a;
        };
    }
    exports_1("Controller", Controller);
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
            constructor.$inject = resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__));
            return cls;
            var _a;
        };
    }
    exports_1("Filter", Filter);
    /**
     * backport of the Angular4 component decorator
     * @param options
     * @returns {(constructor:T)=>any}
     * @constructor
     */
    function Component(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = controllerBinding.concat(resolveRequires(options.requires)).concat(resolveRequires(constructor.prototype.__injections__)).concat([constructor]);
            var tempBindings = constructor.prototype["__bindings__"] || {};
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            var cls = (_a = (function () {
                    function GenericComponent() {
                        this.__selector__ = options.selector;
                        this.bindings = tempBindings;
                        this.controllerAs = options.controllerAs || "";
                        this.controller = controllerBinding;
                        this.transclude = options.transclude || false;
                    }
                    return GenericComponent;
                }()),
                _a.__component__ = true,
                //class extends constructor {
                _a.__template__ = options.template,
                _a.__templateUrl__ = options.templateUrl,
                _a);
            constructor.prototype.__component__ = cls;
            return cls;
            var _a;
        };
    }
    exports_1("Component", Component);
    function Directive(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__));
            var tempBindings = constructor.prototype["__bindings__"] || {};
            if (options.bindings) {
                for (var key in options.bindings) {
                    tempBindings[key] = options.bindings[key];
                }
            }
            var cls = (_a = (function (_super) {
                    __extends(GenericDirective, _super);
                    function GenericDirective() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        //class extends constructor {
                        _this.template = function () {
                            return options.template || "";
                        };
                        _this.bindings = tempBindings;
                        _this.controllerAs = options.controllerAs || "";
                        //controller = controllerBinding;
                        _this.transclude = options.transclude || false;
                        _this.restrict = options.restrict || "E";
                        _this.priority = options.priority || 0;
                        _this.replace = !!options.replace;
                        return _this;
                    }
                    return GenericDirective;
                }(constructor)),
                _a.__directive__ = true,
                _a.__bindings__ = controllerBinding,
                _a.__name__ = options.selector,
                _a);
            constructor.prototype.__component__ = cls;
            return cls;
            var _a;
        };
    }
    exports_1("Directive", Directive);
    function Config(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = controllerBinding.concat(resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__))).concat(function () {
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
    exports_1("Config", Config);
    function Run(options) {
        return function (constructor) {
            var controllerBinding = [];
            controllerBinding = controllerBinding.concat(resolveRequires(options.requires).concat(resolveRequires(constructor.prototype.__injections__))).concat(function () {
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
    exports_1("Run", Run);
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
                _a.__value__ = "undefined" != typeof target[propertyName] ? target[propertyName] : new target.constructor()[propertyName],
                _a);
            target[propertyName] = cls;
            target.__constructorHolder__ = true;
            var _a;
        };
    }
    exports_1("Constant", Constant);
    function getBindings(target) {
        if (!target.constructor.prototype["__bindings__"]) {
            target.constructor.prototype["__bindings__"] = {};
        }
        return target.constructor.prototype.__bindings__;
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
    exports_1("Input", Input);
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
    exports_1("Both", Both);
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
    exports_1("Out", Out);
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
    exports_1("Func", Func);
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
    exports_1("AString", AString);
    /**
     * injection (other way to inject than requires)
     * @param optional
     * @returns {(target:any, propertyName:string)=>undefined}
     * @constructor
     */
    function Inject(artifact) {
        return function (target, propertyName, pos) {
            //we can use an internal function from angular for the parameter parsing
            var paramNames = angular.injector.$$annotate(target);
            getInjections(target, paramNames.length)[pos] = (artifact) ? artifact : paramNames[pos];
        };
    }
    exports_1("Inject", Inject);
    function getInjections(target, numberOfParams) {
        if (!target.prototype["__injections__"]) {
            target.prototype["__injections__"] = new Array(numberOfParams);
        }
        return target.prototype.__injections__;
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
    exports_1("route", route);
    function uiRoute($routeProvider, controller, route) {
        $routeProvider.when(route, {
            template: controller.__template__,
            controller: controller.__name__,
            controllerAs: controller.__controllerAs__ || "ctrl",
            templateUrl: controller.__templateUrl__
        });
    }
    exports_1("uiRoute", uiRoute);
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
    exports_1("platformBrowserDynamic", platformBrowserDynamic);
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
    exports_1("keepExternals", keepExternals);
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
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=TinyDecorations.js.map